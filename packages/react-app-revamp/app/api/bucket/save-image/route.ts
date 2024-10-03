import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

const IMAGE_PUBLIC_URL = "https://images.jokerace.io";
const IMAGE_UPLOAD_BUCKET = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET as string;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const fileId = formData.get("fileId") as string;
  const type = formData.get("type") as string;

  if (!file || !fileId || !type) {
    return NextResponse.json({ error: "Missing file, fileId, or type" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const input = {
      Bucket: IMAGE_UPLOAD_BUCKET,
      Key: fileId,
      Body: Buffer.from(arrayBuffer),
      ContentType: type,
    };

    const command = new PutObjectCommand(input);
    await s3.send(command);

    const originalUrl = `${IMAGE_PUBLIC_URL}/${fileId}`;
    return NextResponse.json({ url: originalUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Failed to upload image with ID ${fileId} to bucket ${IMAGE_UPLOAD_BUCKET}` },
      { status: 500 },
    );
  }
}
