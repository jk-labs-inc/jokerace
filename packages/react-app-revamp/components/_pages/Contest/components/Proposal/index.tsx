import Collapsible from "@components/UI/Collapsible";
import { Proposal } from "@components/_pages/ProposalContent";
import { isUrlTweet } from "@helpers/isUrlTweet";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { load } from "cheerio";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import { FC, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Tweet, TweetNotFound } from "react-tweet";

interface ContestProposalProps {
  proposal: Proposal;
  contestStatus?: ContestStatus;
  collapsible?: boolean;
  votingOpen?: Date;
}

const extractImageAndTextContent = (content: string) => {
  const $ = load(content);

  let imgTags = "";
  $("img").each((_, imgTag) => {
    imgTags += $.html(imgTag);
  });

  const textElements = $("p, div, span, pre, h1, h2, h3, h4, h5");
  let totalContent = "";
  textElements.each((_, element) => {
    totalContent += $(element).text();
  });

  return { imgTags, totalContent };
};

const ContestProposal: FC<ContestProposalProps> = ({ proposal, contestStatus, collapsible = true }) => {
  const votesOpen = useContestStore(state => state.votesOpen);
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const { imgTags, totalContent } = extractImageAndTextContent(proposal.content);
  const truncatedContent = totalContent.length > 90 ? `${totalContent.substring(0, 90)}...` : totalContent;
  const isOnlyImage = imgTags.length > 0 && totalContent.length === 0;
  const isOnlyText = imgTags.length === 0 && totalContent.length > 0;
  const isImageAndText = imgTags.length > 0 && totalContent.length > 0;
  const [isTweetNotFound, setIsTweetNotFound] = useState(false);
  const interweaveClass = "prose prose-invert imgMobileClass overflow-hidden";

  const arrowButton = (
    <button
      onClick={() => setIsProposalOpen(!isProposalOpen)}
      className={`transition-transform duration-500 ease-in-out transform ${isProposalOpen ? "" : "rotate-180"}`}
    >
      <ChevronUpIcon height={30} />
    </button>
  );

  if (isUrlTweet(truncatedContent)) {
    const tweetId = new URL(truncatedContent).pathname.split("/")[3];
    return (
      <div className="dark">
        <Tweet
          apiUrl={tweetId && `/api/tweet/${tweetId}`}
          id={tweetId}
          key={tweetId}
          onError={() => setIsTweetNotFound(true)}
        />
        {isTweetNotFound && (
          <a target="_blank" rel="nofollow noreferrer" className="text-[16px] underline" href={truncatedContent}>
            {truncatedContent}
          </a>
        )}
      </div>
    );
  }

  if (!collapsible) {
    return (
      <div className="flex flex-col gap-4">
        <Interweave className={interweaveClass} content={proposal.content} matchers={[new UrlMatcher("url")]} />
        {contestStatus === ContestStatus.SubmissionOpen && (
          <p className="text-[16px] text-primary-10">voting opens {formattedVotesOpen}</p>
        )}
      </div>
    );
  }

  const CollapsibleContent = (
    <div>
      <Collapsible isOpen={isProposalOpen}>
        <Interweave className={interweaveClass} content={proposal.content} matchers={[new UrlMatcher("url")]} />
      </Collapsible>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {isOnlyImage && (
        <Interweave className={interweaveClass} content={totalContent} matchers={[new UrlMatcher("url")]} />
      )}

      {isOnlyText && totalContent.length >= 90 ? (
        <>
          <div className="flex gap-4 items-center">
            <Interweave className={interweaveClass} content={totalContent} matchers={[new UrlMatcher("url")]} />
            {arrowButton}
          </div>
          {CollapsibleContent}
        </>
      ) : (
        <Interweave className={interweaveClass} content={totalContent} matchers={[new UrlMatcher("url")]} />
      )}

      {isImageAndText && (
        <>
          <div className="flex gap-4 prose prose-invert items-center">
            <Interweave className={interweaveClass} content={truncatedContent} matchers={[new UrlMatcher("url")]} />
            {arrowButton}
          </div>
          {CollapsibleContent}
        </>
      )}
    </div>
  );
};

export default ContestProposal;
