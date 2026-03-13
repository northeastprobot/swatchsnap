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

function getColorDescriptors(hex: string): { temp: string; lightness: string } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const warmth = (r - b) / 255;
  const lightness =
    luminance > 0.78 ? "very light" : luminance > 0.55 ? "light" : luminance > 0.35 ? "medium" : luminance > 0.18 ? "deep" : "very dark";
  const temp =
    warmth > 0.15 ? "warm" : warmth < -0.15 ? "cool" : "neutral";
  return { temp, lightness };
}

function buildPrompt(
  primaryColorName: string,
  trimColorName: string,
  accentColorName?: string,
  primaryHex?: string,
  trimHex?: string,
  accentHex?: string
): string {
  const primaryDesc = primaryHex ? getColorDescriptors(primaryHex) : null;
  const trimDesc = trimHex ? getColorDescriptors(trimHex) : null;
  const accentDesc = accentHex ? getColorDescriptors(accentHex) : null;

  const primaryFull = primaryHex
    ? `${primaryColorName} (hex ${primaryHex}, ${primaryDesc!.lightness} ${primaryDesc!.temp} tone)`
    : primaryColorName;
  const trimFull = trimHex
    ? `${trimColorName} (hex ${trimHex}, ${trimDesc!.lightness} ${trimDesc!.temp} tone)`
    : trimColorName;

  let prompt = `This is a house exterior photograph. Repaint it with authentic Benjamin Moore paint colors, applied precisely to the correct surfaces:

• WALLS & SIDING — Paint all exterior siding panels, shingles, clapboards, and main body surfaces the color ${primaryFull}. Apply this color uniformly to every wall surface.
• TRIM — Paint all trim elements including fascia boards, soffits, window frames, window casings, corner boards, door casings, porch railings, and any decorative molding the color ${trimFull}.`;

  if (accentColorName) {
    const accentFull = accentHex
      ? `${accentColorName} (hex ${accentHex}, ${accentDesc!.lightness} ${accentDesc!.temp} tone)`
      : accentColorName;
    prompt += `\n• ACCENTS — Paint the front door and any shutters the color ${accentFull}.`;
  }

  prompt += `

Preserve everything else exactly: the house architecture, roof materials and color, windows (glass and hardware), landscaping, driveway, sky, and overall photo composition. Do not alter the structure of the home in any way. 

The final result must look like a professional, photorealistic exterior house painting photograph with accurate, saturated paint colors that match the specified Benjamin Moore color values precisely.`;

  return prompt;
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

    const prompt = buildPrompt(
      primaryColorName,
      trimColorName,
      accentColorName,
      primaryColor,
      trimColor,
      accentColor
    );
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
