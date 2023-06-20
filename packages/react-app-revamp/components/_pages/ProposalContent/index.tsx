import isUrlToImage from "@helpers/isUrlToImage";
import { isUrlTweet } from "@helpers/isUrlTweet";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import styles from "./styles.module.css";
import isProposalDeleted from "@helpers/isProposalDeleted";
import EtheuremAddress from "@components/UI/EtheuremAddress";
interface ProposalContentProps {
  content: string;
  author: string;
}

function renderContent(str: string) {
  let renderedContent = str;
  if (isUrlToImage(renderedContent)) {
    str.match(/^https[^\?]*.(jpg|jpeg|gif|avif|webp|png|tiff|bmp)(\?(.*))?$/gim)?.map(img => {
      renderedContent = renderedContent.replace(img, `<img class="w-auto md:w-full h-auto" src="${img}" alt="" />`);
    });
  }

  if (isUrlTweet(str)) {
    const tweetId =
      str.match(/^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/) === null
        ? new URL(renderedContent).pathname.split("/")[3]
        : //@ts-ignore
          str.match(/^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/)[3];
    return (
      <>
        <a target="_blank" rel="nofollow noreferrer" className="link mb-1 text-2xs" href={str}>
          View on Twitter
        </a>
        <TwitterTweetEmbed tweetId={tweetId} options={{ theme: "dark", dnt: "true" }} />
      </>
    );
  }

  return (
    <div className={`with-link-highlighted prose prose-invert ${styles.content}`}>
      <Interweave content={renderedContent} matchers={[new UrlMatcher("url")]} />
    </div>
  );
}

export const ProposalContent = (props: ProposalContentProps) => {
  const { content, author } = props;
  return (
    <>
      <blockquote
        className={`
        leading-relaxed
        ${isProposalDeleted(content) ? "italic text-neutral-11" : ""}
      `}
      >
        {renderContent(content)}
      </blockquote>
      {!isProposalDeleted(content) && (
        <figcaption className="pt-5 font-mono overflow-hidden text-neutral-12 text-ellipsis whitespace-nowrap">
          {/*@ts-ignore*/}
          <EtheuremAddress
            ethereumAddress={author}
            displayLensProfile={true}
            shortenOnFallback={false}
            withHyphen={true}
          />
        </figcaption>
      )}
    </>
  );
};

export default ProposalContent;
