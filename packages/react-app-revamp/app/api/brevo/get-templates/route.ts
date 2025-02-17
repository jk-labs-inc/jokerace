import apiInstance, { isBrevoConfigured } from "@config/brevo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (!isBrevoConfigured) {
    return NextResponse.json({ error: "Brevo is not configured" }, { status: 400 });
  }

  try {
    const data = await apiInstance.getSmtpTemplates(true);
    return NextResponse.json({ success: true, templates: data.body.templates }, { status: 200 });
  } catch (error: any) {
    console.error("error fetching email templates:", error);
    return NextResponse.json({ error: error.message ?? "failed to fetch email templates" }, { status: 400 });
  }
}
