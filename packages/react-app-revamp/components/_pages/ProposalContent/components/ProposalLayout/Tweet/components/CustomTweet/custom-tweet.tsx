import {
  type TwitterComponents,
  QuotedTweet,
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
    e.nativeEvent.stopImmediatePropagation();
    window.open(tweet.url, "_blank");
  };

  return (
    <div className="w-full text-left">
      <TweetContainer className="w-full md:w-[360px]! min-w-full! text-true-black! bg-neutral-11! m-0!">
        <button className="w-full cursor-pointer" onClick={navigateToTweet}>
          <TweetHeader tweet={tweet} components={components} />
        </button>
        {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
        <TweetBody tweet={tweet} />
        {tweet.mediaDetails?.length ? <TweetMedia tweet={tweet} components={components} /> : null}
        {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
      </TweetContainer>
    </div>
  );
};
