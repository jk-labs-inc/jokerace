"use client";

import { type TweetProps, TweetNotFound, TweetSkeleton, useTweet } from "react-tweet";
import { MyTweet } from "./custom-tweet";

export const Tweet = ({ id, apiUrl, fallback = <TweetSkeleton />, components, onError }: TweetProps) => {
  const { data, error, isLoading } = useTweet(id, apiUrl);

  if (isLoading) return <div id="tweet-skeleton">{fallback}</div>;
  if (error || !data) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound error={onError ? onError(error) : error} />;
  }

  return <MyTweet tweet={data} components={components} />;
};
