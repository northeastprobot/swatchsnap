import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 300;

interface VisualizeRequest {
  image: string; // base64 data URL
  primaryColor: string; // hex
  primaryColorName: string;
  trimColor: string; // hex
  trimColorName: string;
  accentColor?: string; // hex (optional)
  accentColorName?: string;
}

function buildPrompt(
  primaryColor: string,
  primaryColorName: string,
  trimColor: string,
  trimColorName: string,
  accentColor?: string,
  accentColorName?: string
): string {
  let prompt = `Paint the house siding and walls ${primaryColorName}. Paint all trim, soffits, fascia, window frames, and door trim ${trimColorName}.`;

  if (accentColor && accentColorName) {
    prompt += ` Paint the shutters and front door ${accentColorName}.`;
  }

  prompt += ` Keep the exact same house, same structure, same roof, same windows, same landscaping. Only change the paint colors.`;

  return prompt;
}

function buildNegativePrompt(): string {
  return "different house, changed structure, new roof, different windows, different landscaping, blurry, low quality, cartoon, illustration, unrealistic";
}

// Mock response for development without API key
function mockResponse(primaryColor: string, trimColor: string): NextResponse {
  // Return a colored placeholder using a public service
  const color = primaryColor.replace("#", "");
  return NextResponse.json({
    imageUrl: `https://placehold.co/800x600/${color}/FFFFFF?text=SwatchSnap+Preview`,
    mock: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: VisualizeRequest = await req.json();
    const {
      image,
      primaryColor,
      primaryColorName,
      trimColor,
      trimColorName,
      accentColor,
      accentColorName,
    } = body;

    if (!image || !primaryColor || !trimColor) {
      return NextResponse.json(
        { error: "Missing required fields: image, primaryColor, trimColor" },
        { status: 400 }
      );
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;

    // Mock mode if no API token
    if (!apiToken || apiToken.trim() === "") {
      console.log("[SwatchSnap] No REPLICATE_API_TOKEN — returning mock response");
      return mockResponse(primaryColor, trimColor);
    }

    const replicate = new Replicate({ auth: apiToken, useFileOutput: false });

    // Convert base64 data URL to Buffer and upload to Replicate to get a real URL
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Explicitly upload to Replicate Files API and extract the URL as a plain string
    const uploadedFile = await replicate.files.create(imageBuffer);
    const imageFileUrl: string = uploadedFile.urls?.get;
    if (!imageFileUrl) {
      throw new Error("Failed to upload image to Replicate");
    }
    console.log("[SwatchSnap] Uploaded image URL:", imageFileUrl);

    const prompt = buildPrompt(
      primaryColor,
      primaryColorName,
      trimColor,
      trimColorName,
      accentColor,
      accentColorName
    );

    const negativePrompt = buildNegativePrompt();

    console.log("[SwatchSnap] Running Replicate img2img...");
    console.log("[SwatchSnap] Prompt:", prompt);

    // Use InstructPix2Pix — designed for "edit this image" instructions
    // image_guidance_scale controls how closely to follow the original image (higher = more faithful)
    const output = await replicate.run(
      "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
      {
        input: {
          image: imageFileUrl,
          prompt: prompt,
          negative_prompt: negativePrompt,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          image_guidance_scale: 1.5, // 1.5 = strong image fidelity (structure preserved)
          num_outputs: 1,
        },
      }
    );

    // Output is an array of URLs
    const outputArray = output as string[];
    const generatedUrl = Array.isArray(outputArray) ? outputArray[0] : String(output);

    if (!generatedUrl) {
      throw new Error("No image generated from Replicate");
    }

    console.log("[SwatchSnap] Generated image:", generatedUrl);

    return NextResponse.json({ imageUrl: generatedUrl, mock: false });
  } catch (err) {
    console.error("[SwatchSnap] Visualize error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate visualization: ${message}` },
      { status: 500 }
    );
  }
}
