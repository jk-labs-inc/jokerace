import { Proposal } from "@components/_pages/ProposalContent";
import { transform } from "@components/_pages/ProposalContent/utils/markdown";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import Link from "next/link";
import { FC, useState } from "react";
import ProposalContentDeleteButton from "../../Buttons/Delete";
import ProposalLayoutLeaderboardMobile from "./components/Mobile";
import ProposalLayoutLeaderboardRankOrPlaceholder from "./components/RankOrPlaceholder";

interface ProposalLayoutLeaderboardProps {
  proposal: Proposal;
  isMobile: boolean;
  chainName: string;
  contestAddress: string;
  contestStatus: ContestStatus;
  formattedVotingOpen: moment.Moment;
  commentLink: string;
  allowDelete: boolean;
  selectedProposalIds: string[];
  handleVotingModalOpen?: () => void;
  toggleProposalSelection?: (proposalId: string) => void;
}

const ProposalLayoutLeaderboard: FC<ProposalLayoutLeaderboardProps> = ({
  proposal,
  isMobile,
  chainName,
  contestAddress,
  contestStatus,
  formattedVotingOpen,
  commentLink,
  allowDelete,
  selectedProposalIds,
  handleVotingModalOpen,
  toggleProposalSelection,
}) => {
  const [isContentHidden, setIsContentHidden] = useState(true);
  const entryTitle = proposal.metadataFields.stringArray[0];

  const handleToggleVisibility = () => {
    setIsContentHidden(!isContentHidden);
  };

  if (isMobile) {
    return (
      <ProposalLayoutLeaderboardMobile
        proposal={proposal}
        contestStatus={contestStatus}
        commentLink={commentLink}
        allowDelete={allowDelete}
        selectedProposalIds={selectedProposalIds}
        toggleProposalSelection={toggleProposalSelection}
        handleVotingModalOpen={handleVotingModalOpen}
        chainName={chainName}
        contestAddress={contestAddress}
      />
    );
  }

  return (
    <div className={`flex gap-6 ${isContentHidden ? "items-center" : "items-start"}`}>
      {allowDelete && (
        <ProposalContentDeleteButton
          proposalId={proposal.id}
          selectedProposalIds={selectedProposalIds}
          toggleProposalSelection={toggleProposalSelection}
        />
      )}
      <div className="w-full flex flex-col min-h-16 gap-6 bg-true-black shadow-entry-card px-8 py-6 rounded-2xl border border-transparent hover:border-primary-3 transition-colors duration-300 ease-in-out">
        <div className={`flex gap-10 ${isContentHidden ? "items-center" : ""}`}>
          <div className={`${isContentHidden ? "" : "-mt-1"}`}>
            <ProposalLayoutLeaderboardRankOrPlaceholder proposal={proposal} contestStatus={contestStatus} />
          </div>
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center">
              <div className="flex gap-12 items-center">
                <UserProfileDisplay
                  textColor="text-neutral-10"
                  ethereumAddress={proposal.authorEthereumAddress}
                  size="small"
                  shortenOnFallback
                />
                <div className="flex gap-2 items-center">
                  <p className="text-[16px] text-neutral-11 font-bold normal-case">{entryTitle}</p>
                  <Link
                    href={`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`}
                    className="text-neutral-10 hover:text-positive-11 transition-colors duration-300 ease-in-out"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="flex gap-2 items-center ml-auto">
                {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
                  <button
                    onClick={handleVotingModalOpen}
                    className="group min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-neutral-2 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out"
                  >
                    <img
                      src="/contest/upvote.svg"
                      width={16}
                      height={16}
                      alt="upvote"
                      className="flex-shrink-0 transition-all duration-300 ease-in-out group-hover:brightness-0 group-hover:saturate-0"
                    />
                    <p className="text-[16px] font-bold flex-grow text-center">
                      {formatNumberAbbreviated(proposal.votes)}
                    </p>
                  </button>
                ) : null}
                <ChevronDownIcon
                  className={`w-6 h-6 text-positive-11 cursor-pointer transition-transform duration-300 ${isContentHidden ? "" : "transform rotate-180"}`}
                  onClick={handleToggleVisibility}
                />
              </div>
            </div>
            {!isContentHidden && (
              <>
                <div className="animate-reveal">
                  <Interweave
                    className="prose prose-invert interweave-container inline-block w-full text-neutral-9 max-w-[525px]"
                    content={proposal.content}
                    transform={transform}
                    tagName="div"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  {contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed ? (
                    <button
                      onClick={handleVotingModalOpen}
                      className="group min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-positive-11  border border-positive-11 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out"
                    >
                      <img
                        src="/contest/upvote.svg"
                        width={16}
                        height={16}
                        alt="upvote"
                        className="flex-shrink-0 transition-all duration-300 ease-in-out group-hover:brightness-0 group-hover:saturate-0"
                      />
                      <p className="text-[16px] font-bold flex-grow text-center">
                        {formatNumberAbbreviated(proposal.votes)}
                      </p>
                    </button>
                  ) : (
                    <p className="text-neutral-10 text-[16px] font-bold">
                      voting opens {formattedVotingOpen.format("MMMM Do, h:mm a")}
                    </p>
                  )}
                  <Link
                    href={commentLink}
                    className="min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-neutral-9  border border-neutral-9 hover:bg-neutral-9 hover:text-true-black transition-colors duration-300 ease-in-out"
                    shallow
                    scroll={false}
                  >
                    <ChatBubbleLeftEllipsisIcon className="w-4 h-4 flex-shrink-0" />
                    <p className="text-[16px] font-bold flex-grow text-center">{proposal.commentsCount}</p>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalLayoutLeaderboard;