import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import sharp from "sharp";

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

// Parse a hex color string into RGB components
function parseHex(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

// Check if a mask is mostly black (empty/failed mask) — skip if so
async function isMaskEmpty(maskBuffer: Uint8Array): Promise<boolean> {
  const { data } = await sharp(Buffer.from(maskBuffer)).grayscale().raw().toBuffer({ resolveWithObject: true });
  let whitePixels = 0;
  const arr = data as unknown as Uint8Array;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 128) whitePixels++;
  }
  const ratio = whitePixels / arr.length;
  console.log(`[SwatchSnap] Mask white pixel ratio: ${(ratio * 100).toFixed(1)}%`);
  return ratio < 0.01; // less than 1% white = effectively empty
}

// Apply a solid color over the original image, using the mask to define where to blend
async function applyColorToMask(
  originalBuffer: Uint8Array,
  maskBuffer: Uint8Array,
  hexColor: string
): Promise<Buffer<ArrayBuffer>> {
  const meta = await sharp(Buffer.from(originalBuffer)).metadata();
  const width = meta.width!;
  const height = meta.height!;

  const { r, g, b } = parseHex(hexColor);

  // Create solid color layer
  const colorLayer = await sharp({
    create: { width, height, channels: 3, background: { r, g, b } },
  })
    .png()
    .toBuffer() as Buffer<ArrayBuffer>;

  // Resize mask to match image dimensions, grayscale
  const maskGrayscale = await sharp(Buffer.from(maskBuffer))
    .resize(width, height)
    .grayscale()
    .png()
    .toBuffer() as Buffer<ArrayBuffer>;

  // Attach mask as alpha channel to color layer → only shows color where mask is white
  const colorWithAlpha = await sharp(colorLayer)
    .joinChannel(maskGrayscale)
    .toBuffer() as Buffer<ArrayBuffer>;

  // Composite color overlay onto original using multiply blend for a realistic paint look
  const result = await sharp(Buffer.from(originalBuffer))
    .composite([
      {
        input: colorWithAlpha,
        blend: "multiply",
      },
    ])
    .png()
    .toBuffer() as Buffer<ArrayBuffer>;

  return result;
}

// Mock response for development without API key
function mockResponse(primaryColor: string): NextResponse {
  const color = primaryColor.replace("#", "");
  return NextResponse.json({
    imageUrl: `https://placehold.co/800x600/${color}/FFFFFF?text=SwatchSnap+Preview`,
    mock: true,
  });
}

// Download a URL as a Buffer
async function downloadBuffer(url: string): Promise<Buffer<ArrayBuffer>> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer()) as Buffer<ArrayBuffer>;
}

// Run Grounded SAM for one zone, return mask Buffer or null
async function runGroundedSAM(
  replicate: Replicate,
  imageFileUrl: string,
  maskPrompt: string,
  negativeMaskPrompt: string,
  label: string
): Promise<Buffer<ArrayBuffer> | null> {
  console.log(`[SwatchSnap] Running Grounded SAM for: ${label}`);
  try {
    const output = await replicate.run(
      "schananas/grounded_sam:ee871c19efb1941f55f66a3d7d960428c8a5afcb77449547fe8e5a3ab9ebc21c",
      {
        input: {
          image: imageFileUrl,
          mask_prompt: maskPrompt,
          negative_mask_prompt: negativeMaskPrompt,
          adjustment_factor: 0,
        },
      }
    );

    // Output: [annotated_image_url, mask_url]
    const outputArray = output as string[];
    if (!Array.isArray(outputArray) || outputArray.length < 2) {
      console.warn(`[SwatchSnap] Unexpected SAM output for ${label}:`, output);
      return null;
    }

    const maskUrl = outputArray[1];
    console.log(`[SwatchSnap] ${label} mask URL:`, maskUrl);
    return await downloadBuffer(maskUrl);
  } catch (err) {
    console.error(`[SwatchSnap] SAM failed for ${label}:`, err);
    return null;
  }
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
      return mockResponse(primaryColor);
    }

    const replicate = new Replicate({ auth: apiToken, useFileOutput: false });

    // Step 1: Convert base64 data URL to Buffer and upload to Replicate
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, "base64") as Buffer<ArrayBuffer>;

    console.log("[SwatchSnap] Uploading image to Replicate Files API...");
    const uploadedFile = await replicate.files.create(imageBuffer);
    const imageFileUrl: string = uploadedFile.urls?.get;
    if (!imageFileUrl) {
      throw new Error("Failed to upload image to Replicate");
    }
    console.log("[SwatchSnap] Uploaded image URL:", imageFileUrl);

    // Step 2: Run Grounded SAM for each zone in parallel
    console.log("[SwatchSnap] Running Grounded SAM segmentation for all zones...");
    console.log("[SwatchSnap] Primary:", primaryColorName, "| Trim:", trimColorName, accentColor ? `| Accent: ${accentColorName}` : "");

    const samPromises: Promise<Buffer | null>[] = [
      // Walls/siding mask
      runGroundedSAM(
        replicate,
        imageFileUrl,
        "exterior house siding walls clapboard painted surface",
        "windows glass roof shingles door trim fascia soffits sky trees grass",
        "walls"
      ),
      // Trim mask
      runGroundedSAM(
        replicate,
        imageFileUrl,
        "window trim fascia soffits corner boards door trim painted wood trim",
        "siding walls windows glass roof shingles door shutters sky trees",
        "trim"
      ),
    ];

    // Accent mask only if accent color is provided
    if (accentColor && accentColorName) {
      samPromises.push(
        runGroundedSAM(
          replicate,
          imageFileUrl,
          "front door shutters",
          "siding walls windows glass roof trim fascia soffits sky trees",
          "accent"
        )
      );
    }

    const [wallMaskBuffer, trimMaskBuffer, accentMaskBuffer] = await Promise.all(samPromises);

    // Step 3: Apply color overlays using Sharp
    console.log("[SwatchSnap] Applying color overlays with Sharp...");

    let current: Buffer<ArrayBuffer> = imageBuffer;

    // Apply walls/siding color
    if (wallMaskBuffer) {
      const empty = await isMaskEmpty(wallMaskBuffer);
      if (empty) {
        console.warn("[SwatchSnap] Wall mask is empty — skipping walls overlay");
      } else {
        console.log("[SwatchSnap] Applying primary color to walls:", primaryColor);
        current = await applyColorToMask(current, wallMaskBuffer, primaryColor);
      }
    } else {
      console.warn("[SwatchSnap] No wall mask returned — skipping walls overlay");
    }

    // Apply trim color on top
    if (trimMaskBuffer) {
      const empty = await isMaskEmpty(trimMaskBuffer);
      if (empty) {
        console.warn("[SwatchSnap] Trim mask is empty — skipping trim overlay");
      } else {
        console.log("[SwatchSnap] Applying trim color:", trimColor);
        current = await applyColorToMask(current, trimMaskBuffer, trimColor);
      }
    } else {
      console.warn("[SwatchSnap] No trim mask returned — skipping trim overlay");
    }

    // Apply accent color on top (if provided)
    if (accentColor && accentMaskBuffer) {
      const empty = await isMaskEmpty(accentMaskBuffer);
      if (empty) {
        console.warn("[SwatchSnap] Accent mask is empty — skipping accent overlay");
      } else {
        console.log("[SwatchSnap] Applying accent color:", accentColor);
        current = await applyColorToMask(current, accentMaskBuffer, accentColor);
      }
    }

    // Step 4: Convert final result to JPEG and encode as base64 data URL
    console.log("[SwatchSnap] Converting final image to JPEG...");
    const finalJpeg = await sharp(Buffer.from(current)).jpeg({ quality: 90 }).toBuffer();
    const finalBase64 = finalJpeg.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${finalBase64}`;

    console.log("[SwatchSnap] Done! Returning result.");
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
