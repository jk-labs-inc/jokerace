import { createFileRoute } from "@tanstack/react-router";
import { getTweet } from "react-tweet/api";

export const Route = createFileRoute("/api/tweet/$id")({
  server: {
    handlers: {
      GET: async ({ params }: { params: { id: string } }) => {
        try {
          const tweet = await getTweet(params.id);
          return new Response(JSON.stringify({ data: tweet ?? null }), {
            status: tweet ? 200 : 404,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(error);
          return new Response(JSON.stringify({ error: error.message ?? "Bad request." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
} as any);
