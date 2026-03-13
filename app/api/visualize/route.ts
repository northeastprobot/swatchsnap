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
  let prompt = `Professional exterior house painting photograph. The house walls and siding are painted ${primaryColorName} (${primaryColor}). The trim, fascia, soffits, and window frames are painted ${trimColorName} (${trimColor}).`;

  if (accentColor && accentColorName) {
    prompt += ` The front door and shutters are painted ${accentColorName} (${accentColor}).`;
  }

  prompt += ` High quality, photorealistic, professional architectural photography, natural lighting, sharp details, Benjamin Moore paint colors.`;

  return prompt;
}

function buildNegativePrompt(): string {
  return "blurry, low quality, distorted, unrealistic, cartoon, illustration, sketch, painting, oversaturated, weird colors, bad proportions";
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

    // Force upload strategy so Blobs are uploaded to Replicate CDN (not base64 encoded)
    const replicate = new Replicate({ auth: apiToken, fileEncodingStrategy: "upload" });

    // Convert base64 data URL to Blob
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, "base64");
    const imageBlob = new Blob([imageBuffer], { type: mimeType });

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
          image: imageBlob,
          prompt: prompt,
          negative_prompt: negativePrompt,
          prompt_strength: 0.55, // Balance between original structure and color changes
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
