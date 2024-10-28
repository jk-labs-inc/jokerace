import { FC } from "react";
import { TweetContainer, TweetNotFound } from "react-tweet";

interface CustomTweetNotFoundProps {
  error?: any;
  onError?: (error: any) => any;
}

const CustomTweetNotFound: FC<CustomTweetNotFoundProps> = ({ error, onError }) => {
  return (
    <div className="min-w-full text-neutral-9 text-[16px] bg-true-black m-0 border-primary-1">
      <p>the embedded tweet was not found...</p>
    </div>
  );
};

export default CustomTweetNotFound;
