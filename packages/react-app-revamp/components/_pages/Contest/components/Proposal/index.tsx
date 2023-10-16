import { Proposal } from "@components/_pages/ProposalContent";
import { extractPathSegments } from "@helpers/extractPath";
import { isUrlTweet } from "@helpers/isUrlTweet";
import {
  generateLensShareUrlForSubmission,
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
import { FC, useState } from "react";
import { Tweet } from "react-tweet";

interface ContestProposalProps {
  proposal: Proposal;
  proposalId?: string;
  displaySocials?: boolean;
  contestStatus?: ContestStatus;
  votingOpen?: Date;
}

const ContestProposal: FC<ContestProposalProps> = ({ proposal, proposalId, contestStatus, displaySocials }) => {
  const router = useRouter();
  const asPath = router.asPath;
  const { chainName, address } = extractPathSegments(asPath);
  const votesOpen = useContestStore(state => state.votesOpen);
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const [isTweetNotFound, setIsTweetNotFound] = useState(false);

  if (isUrlTweet(proposal.content)) {
    const tweetId = new URL(proposal.content).pathname.split("/")[3];
    return (
      <div className="dark">
        <Tweet
          apiUrl={tweetId && `/api/tweet/${tweetId}`}
          id={tweetId}
          key={tweetId}
          onError={() => setIsTweetNotFound(true)}
        />
        {isTweetNotFound && (
          <a target="_blank" rel="nofollow noreferrer" className="text-[16px] underline" href={proposal.content}>
            {proposal.content}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Interweave
        className="prose prose-invert imgMobileClass overflow-hidden"
        content={proposal.content}
        matchers={[new UrlMatcher("url")]}
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
            className={`flex items-center  bg-neutral-13 rounded-full overflow-hidden w-8 h-8`}
            href={generateTwitterShareUrlForSubmission(address, chainName, proposalId)}
            target="_blank"
          >
            <Image
              width={28}
              height={28}
              className="object-cover m-auto grayscale"
              src="/socials/share-submission/facebook.svg"
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
