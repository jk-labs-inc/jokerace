import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getTweet, Tweet } from "react-tweet/api";

type ExtendedTweet =
  | (Tweet & {
      tombstone?: any;
    })
  | undefined;

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const tweetId = req.query.tweet;

  if (req.method !== "GET" || typeof tweetId !== "string") {
    res.status(400).json({ error: "Bad Request." });
    return;
  }

  try {
    const tweet: ExtendedTweet = await getTweet(tweetId);
    if (tweet?.tombstone) {
      res.status(404).json({ error: "Tweet deleted", data: tweet });
      return;
    }
    res.status(tweet ? 200 : 404).json({ data: tweet ?? null });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message ?? "Bad request." });
  }
};

export default handler;
