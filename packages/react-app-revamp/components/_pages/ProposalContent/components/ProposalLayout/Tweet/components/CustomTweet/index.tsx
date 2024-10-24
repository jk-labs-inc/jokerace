"use client";

import { type TweetProps, TweetNotFound, TweetSkeleton, useTweet } from "react-tweet";
import { MyTweet } from "./custom-tweet";

interface ExtendedTweetProps {
  id?: string;
  apiUrl?: string;
  fallback?: React.ReactNode;
  components?: TweetProps["components"];
  onError?: TweetProps["onError"];
  rank?: React.ReactNode;
}

export const Tweet = ({ id, apiUrl, fallback = <TweetSkeleton />, components, onError, rank }: ExtendedTweetProps) => {
  const { data, error, isLoading } = useTweet(id, apiUrl);

  if (isLoading) return <div id="tweet-skeleton">{fallback}</div>;
  if (error || !data) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound error={onError ? onError(error) : error} />;
  }

  return <MyTweet tweet={data} components={components} rank={rank} />;
};
