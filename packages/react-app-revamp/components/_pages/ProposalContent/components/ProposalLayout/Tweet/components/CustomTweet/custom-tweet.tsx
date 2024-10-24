import {
  type TwitterComponents,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetInReplyTo,
  TweetMedia,
  enrichTweet,
} from "react-tweet";
import type { Tweet } from "react-tweet/api";

type Props = {
  tweet: Tweet;
  components?: TwitterComponents;
  rank?: React.ReactNode;
};

export const MyTweet = ({ tweet: t, components, rank }: Props) => {
  const tweet = enrichTweet(t);
  return (
    <div className="relative">
      {rank && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {rank}
        </div>
      )}
      <TweetContainer className="!min-w-full !bg-true-black !m-0 !border-primary-1 !p-2">
        <TweetHeader tweet={tweet} components={components} />
        {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
        <TweetBody tweet={tweet} />
        {tweet.mediaDetails?.length ? <TweetMedia tweet={tweet} components={components} /> : null}
      </TweetContainer>
    </div>
  );
};
