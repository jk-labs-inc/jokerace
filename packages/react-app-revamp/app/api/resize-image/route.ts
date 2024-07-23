import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const SIZES = {
  original: { width: 1920, height: 1080 },
  medium: { width: 600, height: 400 },
  thumbnail: { width: 200, height: 200 },
};

export async function POST(request: NextRequest) {
  const { buffer, contentType } = await request.json();

  try {
    const image = sharp(Buffer.from(buffer, "base64"), { animated: true });
    const metadata = await image.metadata();
    const isAnimated = metadata.pages && metadata.pages > 1;

    const resizedImages: Record<string, { data: string; contentType: string }> = {};

    for (const [size, dimensions] of Object.entries(SIZES)) {
      let resizedImage = image.resize({
        width: dimensions.width,
        height: dimensions.height,
        fit: "inside",
        withoutEnlargement: true,
      });

      let outputBuffer;
      if (isAnimated && contentType === "image/gif") {
        outputBuffer = await resizedImage.gif({ dither: 0 }).toBuffer();
      } else if (isAnimated && contentType === "image/webp") {
        outputBuffer = await resizedImage.webp({ quality: 80 }).toBuffer();
      } else {
        outputBuffer = await resizedImage.jpeg({ quality: size === "original" ? 85 : 80 }).toBuffer();
      }

      resizedImages[size] = {
        data: outputBuffer.toString("base64"),
        contentType: isAnimated ? contentType : "image/jpeg",
      };
    }

    return NextResponse.json({
      success: true,
      resizedImages,
    });
  } catch (error) {
    console.error("Image processing failed:", error);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
