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

const MERKLE_TREES_BUCKET = process.env.NEXT_PUBLIC_MERKLE_TREES_BUCKET as string;

export async function POST(request: NextRequest) {
  try {
    const { fileId, content } = await request.json();

    if (!fileId || !content) {
      return NextResponse.json({ error: "Missing fileId or content" }, { status: 400 });
    }

    const input = {
      Bucket: MERKLE_TREES_BUCKET,
      Key: fileId,
      Body: JSON.stringify(content),
      ContentType: "application/json",
    };
    const command = new PutObjectCommand(input);

    await s3.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error saving file to bucket: ${error}`);
    return NextResponse.json({ error: `Failed to save file to bucket ${MERKLE_TREES_BUCKET}` }, { status: 500 });
  }
}
