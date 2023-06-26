/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import ButtonV3 from "@components/UI/ButtonV3";
import EtheuremAddress from "@components/UI/EtheuremAddress";
import { isUrlTweet } from "@helpers/isUrlTweet";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TwitterTweetEmbed } from "react-twitter-embed";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { AnyNode, load } from "cheerio";
import { formatNumber } from "@helpers/formatNumber";

enum ProposalStatus {
  VoteNotOpened,
  VoteOpen,
  VoteEnded,
}

interface ProposalContentProps {
  proposal: {
    authorEthereumAddress: string;
    content: string;
    exists: boolean;
    isContentImage: boolean;
    votes: number;
  };
  votingOpen: Date;
  votingClose: Date;
}

const MAX_LENGTH = 150;
const MAX_LENGTH_PARAGRAPH = 50;

const ProposalContent: FC<ProposalContentProps> = ({ proposal, votingOpen, votingClose }) => {
  let truncatedContent =
    proposal.content.length > MAX_LENGTH ? `${proposal.content.substring(0, MAX_LENGTH)}...` : proposal.content;
  const now = moment();
  const formattedVotingOpen = moment(votingOpen);
  const formattedVotingClose = moment(votingClose);

  const [proposalStatus, setProposalStatus] = useState<ProposalStatus>(ProposalStatus.VoteNotOpened);

  const ProposalAction = useMemo<React.ReactNode>(() => {
    switch (proposalStatus) {
      case ProposalStatus.VoteNotOpened:
        return (
          <>
            <p className="text-neutral-11">voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}</p>
          </>
        );
      case ProposalStatus.VoteOpen:
        return (
          <>
            <p className="text-positive-11">{formatNumber(proposal.votes)} votes</p>
            <ButtonV3 color="bg-gradient-vote rounded-[40px]" size="large">
              vote
            </ButtonV3>
          </>
        );
      case ProposalStatus.VoteEnded:
        return (
          <>
            <p className="text-positive-11">{formatNumber(proposal.votes)} votes</p>
            <p className="text-neutral-10">voting closed</p>
          </>
        );
    }
  }, [proposalStatus]);

  useEffect(() => {
    if (now.isBefore(formattedVotingOpen)) {
      setProposalStatus(ProposalStatus.VoteNotOpened);
    } else if (now.isBetween(formattedVotingOpen, formattedVotingClose)) {
      setProposalStatus(ProposalStatus.VoteOpen);
    } else {
      setProposalStatus(ProposalStatus.VoteEnded);
    }
  }, [now, formattedVotingOpen, formattedVotingClose]);

  if (isUrlTweet(truncatedContent)) {
    const tweetId = new URL(truncatedContent).pathname.split("/")[3];
    return (
      <>
        <a target="_blank" rel="nofollow noreferrer" className="link mb-1 text-2xs" href={truncatedContent}>
          View on Twitter
        </a>
        <TwitterTweetEmbed tweetId={tweetId} options={{ theme: "dark", dnt: "true" }} />
      </>
    );
  }

  if (proposal.isContentImage) {
    const $ = load(proposal.content);

    let imgTags = "";
    let otherTags = "";

    $("img").each((_, imgTag) => {
      imgTags += $.html(imgTag);
    });

    const textElements = $("p, div, span, pre, h1, h2, h3, h4, h5");

    textElements.each((_, element) => {
      otherTags += $(element).text();
    });

    let totalContent = otherTags;
    if (totalContent.length > MAX_LENGTH_PARAGRAPH) {
      totalContent = totalContent.substring(0, MAX_LENGTH_PARAGRAPH) + "...";
    }

    textElements.each((i, element) => {
      const currentText = $(element).text();
      const newText = totalContent.substring(0, currentText.length);
      totalContent = totalContent.substring(currentText.length);

      $(element).text(newText);
    });

    const finalContent = imgTags + textElements.toString();

    truncatedContent = `<div>${finalContent}</div>`;
  }

  return (
    <div className="flex flex-col w-full h-56 animate-appear rounded-[10px] border border-neutral-11 prose hover:bg-neutral-1 transition-colors duration-500 ease-in-out cursor-pointer">
      <div className="flex items-center px-8 py-2 h-3/4">
        <ReactMarkdown
          className="prose-invert"
          components={{
            img: ({ node, ...props }) => <img {...props} className="w-[170px] h-[130px]" alt="image" />,
            div: ({ node, children, ...props }) => (
              <div {...props} className="flex gap-5 items-center">
                {children}
              </div>
            ),
          }}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          children={truncatedContent}
        />
      </div>

      <div className="border-t border-neutral-10 h-1/4 flex items-center">
        <div className="flex pl-8 w-1/2 h-full border-r border-neutral-10">
          <EtheuremAddress
            ethereumAddress={proposal.authorEthereumAddress}
            shortenOnFallback={true}
            displayLensProfile={true}
          />
        </div>
        <div className="flex items-center justify-between pl-4 pr-4 w-1/2 h-full text-[16px] font-bold">
          {ProposalAction}
        </div>
      </div>
    </div>
  );
};

export default ProposalContent;
