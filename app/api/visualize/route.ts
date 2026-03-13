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
  let prompt = `Exterior house paint color visualization. Keep the EXACT same house — identical structure, architecture, roofline, windows, doors, porch, landscaping, and viewpoint. Do NOT change anything structural. ONLY change the paint colors as follows: all siding, body, and walls painted ${primaryColorName} color ${primaryColor}; all trim including soffits, fascia, window trim, door trim, and corner boards painted ${trimColorName} color ${trimColor};`;

  if (accentColor && accentColorName) {
    prompt += ` shutters, front door, and accent details painted ${accentColorName} color ${accentColor};`;
  }

  prompt += ` photorealistic, professional architectural photography, natural daylight, sharp focus, Benjamin Moore paint colors, same house same composition.`;

  return prompt;
}

function buildNegativePrompt(): string {
  return "different house, new construction, renovated structure, changed architecture, different windows, different roof, different layout, moved landscaping, blurry, low quality, distorted, cartoon, illustration, unrealistic, oversaturated";
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

    // Use stability-ai/stable-diffusion-img2img
    // The model takes an image and transforms it based on the prompt
    const output = await replicate.run(
      "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d",
      {
        input: {
          image: imageFileUrl,
          prompt: prompt,
          negative_prompt: negativePrompt,
          prompt_strength: 0.6, // 0.6 = strong color change while preserving house structure
          num_inference_steps: 30,
          guidance_scale: 7.5,
          num_outputs: 1,
          scheduler: "K_EULER_ANCESTRAL",
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
