import type { VercelRequest, VercelResponse } from "@vercel/node";

interface LogMessage {
  message: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const logMessage: LogMessage = req.body;
    console.log(logMessage);
    res.status(200).json({ message: "Log received" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
