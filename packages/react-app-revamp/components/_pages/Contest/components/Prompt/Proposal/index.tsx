import { Proposal } from "@components/_pages/ProposalContent";
import { extractPathSegments } from "@helpers/extractPath";
import { twitterRegex } from "@helpers/regex";
import {
  generateFacebookShareUrlForSubmission,
  generateFarcasterShareUrlForSubmission,
  generateLensShareUrlForSubmission,
  generateLinkedInShareUrlForSubmission,
  generateTwitterShareUrlForSubmission,
  generateUrlSubmissions,
} from "@helpers/share";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { ProposalState } from "lib/proposal";
import moment from "moment";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";
import { Tweet } from "react-tweet";

interface ContestProposalProps {
  proposal: Proposal;
  proposalId?: string;
  displaySocials?: boolean;
  contestStatus?: ContestStatus;
  votingOpen?: Date;
}

const transform = (node: HTMLElement): ReactNode => {
  const element = node.tagName.toLowerCase();
  if (element === "a") {
    const href = node.getAttribute("href");
    const tweetUrlMatch = href && href.match(twitterRegex);

    const isInsideList =
      node.parentNode?.parentNode?.nodeName === "li" ||
      node.parentNode?.parentNode?.nodeName === "ul" ||
      node.parentNode?.parentNode?.nodeName === "ol";

    if (tweetUrlMatch) {
      if (isInsideList) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {node.childNodes[0]?.textContent || ""}
          </a>
        );
      }

      const hasTextContent = node.childNodes[0]?.textContent && node.childNodes[0]?.textContent !== href;

      if (hasTextContent) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {node.childNodes[0]?.textContent}
          </a>
        );
      } else {
        const tweetId = tweetUrlMatch[4] || tweetUrlMatch[2];
        return (
          <div className="dark not-prose">
            <Tweet apiUrl={`/api/tweet/${tweetId}`} id={tweetId} />
          </div>
        );
      }
    }
  }
};

const ContestProposal: FC<ContestProposalProps> = ({ proposal, proposalId, contestStatus, displaySocials }) => {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const { votesOpen, contestName } = useContestStore(state => state);
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");

  return (
    <div className="flex flex-col gap-4">
      {proposal.content === ProposalState.Deleted ? (
        <p className="text-[16px] text-neutral-11">{ProposalState.Deleted}</p>
      ) : (
        <Interweave
          className="prose prose-invert overflow-hidden"
          content={proposal.content}
          matchers={[new UrlMatcher("url")]}
          transform={transform}
        />
      )}
    </div>
  );
};

export default ContestProposal;
