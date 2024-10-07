import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const fetchCache = "force-no-store";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

const MERKLE_TREES_BUCKET = process.env.NEXT_PUBLIC_MERKLE_TREES_BUCKET as string;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({ error: "Missing fileId parameter" }, { status: 400 });
  }

  try {
    const input = {
      Bucket: MERKLE_TREES_BUCKET,
      Key: fileId,
    };
    const command = new GetObjectCommand(input);
    const response = await s3.send(command);

    if (response.Body) {
      const dataString = await response.Body.transformToString("utf-8");
      const data = JSON.parse(dataString);
      return NextResponse.json({ data });
    }
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  } catch (error) {
    console.error(`Error loading file from bucket: ${error}`);
    return NextResponse.json(
      { error: `Failed to load file with ID ${fileId} from bucket ${MERKLE_TREES_BUCKET}` },
      { status: 500 },
    );
  }
}
