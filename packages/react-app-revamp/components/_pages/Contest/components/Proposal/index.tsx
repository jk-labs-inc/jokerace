import { Proposal } from "@components/_pages/ProposalContent";
import { extractPathSegments } from "@helpers/extractPath";
import { twitterRegex } from "@helpers/regex";
import {
  generateFacebookShareUrlForSubmission,
  generateLensShareUrlForSubmission,
  generateLinkedInShareUrlForSubmission,
  generateTwitterShareUrlForSubmission,
  generateUrlSubmissions,
} from "@helpers/share";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
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
    if (tweetUrlMatch) {
      if (node.parentNode?.parentNode?.nodeName === "li" || node.parentNode?.parentNode?.nodeName === "ul") {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {node.childNodes[0].textContent}
          </a>
        );
      }
      const tweetId = tweetUrlMatch[4] || tweetUrlMatch[2];

      return (
        <div className="dark not-prose">
          <Tweet apiUrl={`/api/tweet/${tweetId}`} id={tweetId} />
        </div>
      );
    }
  }
};

const ContestProposal: FC<ContestProposalProps> = ({ proposal, proposalId, contestStatus, displaySocials }) => {
  const router = useRouter();
  const asPath = router.asPath;
  const { chainName, address } = extractPathSegments(asPath);
  const votesOpen = useContestStore(state => state.votesOpen);
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");

  return (
    <div className="flex flex-col gap-4">
      <Interweave
        className="prose prose-invert overflow-hidden"
        content={proposal.content}
        matchers={[new UrlMatcher("url")]}
        transform={transform}
      />
      {displaySocials && proposalId ? (
        <div className="hidden md:flex gap-2">
          <a
            className={`flex items-center  bg-neutral-12 rounded-full overflow-hidden w-8 h-8`}
            href={generateLensShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <Image
              width={32}
              height={32}
              className="object-cover grayscale"
              src="/socials/lens-leaf.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center  bg-neutral-13 rounded-full overflow-hidden w-8 h-8`}
            href={generateTwitterShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <Image
              width={28}
              height={28}
              className="object-cover m-auto"
              src="/socials/twitter-light.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center rounded-full overflow-hidden w-8 h-8`}
            href={generateFacebookShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <Image
              width={30}
              height={30}
              className="object-cover m-auto grayscale"
              src="/socials/share-submission/facebook.svg"
              alt="avatar"
            />
          </a>
          <a
            className={`flex items-center   rounded-full overflow-hidden w-8 h-8`}
            href={generateLinkedInShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <Image
              width={34}
              height={34}
              className="object-cover m-auto grayscale"
              src="/socials/share-submission/linkedin.svg"
              alt="avatar"
            />
          </a>

          <div
            className={`flex items-center bg-true-black rounded-full border-neutral-11 border overflow-hidden w-8 h-8 cursor-pointer`}
            onClick={() =>
              navigator.share({
                url: generateUrlSubmissions(address, chainName, ""),
              })
            }
          >
            <Image src="/forward.svg" alt="share" className="object-cover m-auto" width={15} height={13} />
          </div>
        </div>
      ) : null}

      {contestStatus === ContestStatus.SubmissionOpen && (
        <p className="text-[16px] text-primary-10">voting opens {formattedVotesOpen}</p>
      )}
    </div>
  );
};

export default ContestProposal;
