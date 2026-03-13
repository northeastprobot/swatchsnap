import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";

export const maxDuration = 300;

interface VisualizeRequest {
  image: string; // base64 data URL
  primaryColor: string;
  primaryColorName: string;
  trimColor: string;
  trimColorName: string;
  accentColor?: string;
  accentColorName?: string;
}

function buildPrompt(
  primaryColorName: string,
  trimColorName: string,
  accentColorName?: string
): string {
  let prompt = `This is a house exterior. Repaint it with the following Benjamin Moore colors: paint all siding, walls, and body of the house ${primaryColorName}. Paint all trim, fascia, soffits, window frames, corner boards, and door trim ${trimColorName}.`;

  if (accentColorName) {
    prompt += ` Paint the front door and shutters ${accentColorName}.`;
  }

  prompt += ` Keep everything else exactly the same — same house structure, same roof, same windows, same landscaping, same photo composition. Only the paint colors change. Make it look like a professional, photorealistic exterior house painting photograph.`;

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const body: VisualizeRequest = await req.json();
    const {
      image,
      primaryColorName,
      trimColorName,
      accentColorName,
    } = body;

    if (!image || !primaryColorName || !trimColorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Convert base64 data URL to Buffer
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const mimeType = matches[1] as "image/jpeg" | "image/png" | "image/webp";
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, "base64");

    const prompt = buildPrompt(primaryColorName, trimColorName, accentColorName);
    console.log("[SwatchSnap] OpenAI prompt:", prompt);

    // Convert buffer to File object for OpenAI
    const ext = mimeType.split("/")[1];
    const imageFile = await toFile(imageBuffer, `house.${ext}`, { type: mimeType });

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt,
      size: "1024x1024",
      quality: "high",
    });

    const imageData = response.data?.[0];
    if (!imageData) {
      throw new Error("No image returned from OpenAI");
    }

    // gpt-image-1 returns base64 by default
    const resultBase64 = imageData.b64_json;
    const resultUrl = imageData.url;

    const imageUrl = resultBase64
      ? `data:image/png;base64,${resultBase64}`
      : resultUrl;

    if (!imageUrl) {
      throw new Error("No image data in OpenAI response");
    }

    console.log("[SwatchSnap] Success — image generated via OpenAI gpt-image-1");
    return NextResponse.json({ imageUrl, mock: false });

  } catch (err) {
    console.error("[SwatchSnap] Visualize error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate visualization: ${message}` },
      { status: 500 }
    );
  }
}
