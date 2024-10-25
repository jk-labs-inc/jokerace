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
};

export const MyTweet = ({ tweet: t, components }: Props) => {
  const tweet = enrichTweet(t);

  const navigateToTweet = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open(tweet.url, "_blank");
  };

  return (
    <button className="w-full text-left cursor-pointer" onClick={navigateToTweet}>
      <TweetContainer className="!min-w-full !text-neutral-9  !bg-true-black !m-0 !border-primary-1">
        <TweetHeader tweet={tweet} components={components} />
        {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
        <TweetBody tweet={tweet} />
        {tweet.mediaDetails?.length ? <TweetMedia tweet={tweet} components={components} /> : null}
      </TweetContainer>
    </button>
  );
};
