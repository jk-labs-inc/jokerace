import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const SIZES = {
  medium: { width: 500, height: 300 },
  thumbnail: { width: 200, height: 200 },
};

export async function POST(request: NextRequest) {
  const { originalUrl } = await request.json();

  try {
    const response = await fetch(originalUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const image = sharp(buffer);
    const resizedImages: Record<string, string> = {};

    for (const [size, dimensions] of Object.entries(SIZES)) {
      const resizedBuffer = await image
        .resize(dimensions.width, dimensions.height, { fit: "inside", withoutEnlargement: true })
        .toBuffer();

      resizedImages[size] = resizedBuffer.toString("base64");
    }

    return NextResponse.json({
      success: true,
      resizedImages,
      contentType: response.headers.get("content-type") || "image/jpeg",
    });
  } catch (error) {
    console.error("Image processing failed:", error);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
