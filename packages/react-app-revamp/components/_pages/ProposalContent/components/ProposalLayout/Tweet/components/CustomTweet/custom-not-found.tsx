import { FC } from "react";
import { TweetContainer } from "react-tweet";

interface CustomTweetNotFoundProps {
  id?: string;
  error?: any;
  onError?: (error: any) => any;
}

const CustomTweetNotFound: FC<CustomTweetNotFoundProps> = ({ error, onError, id }) => {
  const tweetUrl = id ? `https://x.com/i/status/${id}` : null;

  const navigateToTweet = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    if (tweetUrl) {
      window.open(tweetUrl, "_blank");
    }
  };

  return (
    <TweetContainer className="w-full md:!w-[360px] !min-w-full !text-neutral-9 !bg-true-black !m-0 !border-primary-1">
      <div className="flex flex-col p-4 gap-4 min-w-full text-neutral-9">
        <div className="flex flex-col gap-2">
          <p className="text-[16px] text-neutral-9">sorry, we couldn't load this tweet</p>
          <p className="text-[14px] text-neutral-9">
            the tweet may have been deleted or flagged as containing sensitive content
          </p>
        </div>

        {tweetUrl && (
          <a
            href={tweetUrl}
            onClick={navigateToTweet}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[16px] text-positive-11 opacity-80 hover:opacity-100 transition-colors"
          >
            view on x.com {">"}
          </a>
        )}
      </div>
    </TweetContainer>
  );
};

export default CustomTweetNotFound;
