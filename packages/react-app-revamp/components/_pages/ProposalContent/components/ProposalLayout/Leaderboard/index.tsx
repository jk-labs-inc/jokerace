import { Proposal } from "@components/_pages/ProposalContent";
import { transform } from "@components/_pages/ProposalContent/utils/markdown";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ChatBubbleLeftEllipsisIcon, ChevronDownIcon, ChevronRightIcon, LinkIcon } from "@heroicons/react/24/outline";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { Interweave } from "interweave";
import Link from "next/link";
import { FC, useState } from "react";
import ProposalContentDeleteButton from "../../Buttons/Delete";
import ProposalContentProfile from "../../Profile";
import ProposalLayoutLeaderboardMobile from "./components/Mobile";
import ProposalLayoutLeaderboardRankOrPlaceholder from "./components/RankOrPlaceholder";
import { toastInfo } from "@components/UI/Toast";

interface ProposalLayoutLeaderboardProps {
  proposal: Proposal;
  proposalAuthorData: {
    name: string;
    avatar: string;
    isLoading: boolean;
    isError: boolean;
  };
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
  proposalAuthorData,
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

  const copyLink = () => {
    const url = `${window.location.origin}/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`;
    navigator.clipboard.writeText(url);
    toastInfo("link copied!");
  };

  if (isMobile) {
    return (
      <ProposalLayoutLeaderboardMobile
        proposal={proposal}
        proposalAuthorData={proposalAuthorData}
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
            <div className="grid grid-cols-[200px_1fr_auto] items-center gap-12">
              <ProposalContentProfile
                name={proposalAuthorData.name}
                avatar={proposalAuthorData.avatar}
                isLoading={proposalAuthorData.isLoading}
                isError={proposalAuthorData.isError}
                textColor="text-neutral-10"
              />
              <div className="flex gap-2 items-center">
                <p className="text-[16px] text-neutral-11 font-bold normal-case">{entryTitle}</p>
                <Link
                  href={`/contest/${chainName.toLowerCase()}/${contestAddress}/submission/${proposal.id}`}
                  className="w-4 h-4 flex justify-center items-center rounded-full border text-positive-11 border-positive-11 hover:bg-positive-11 hover:text-true-black transition-colors duration-300 ease-in-out group"
                >
                  <ChevronRightIcon className="w-4 h-4 group-hover:brightness-0 group-hover:saturate-0" />
                </Link>
              </div>
              <div className="flex gap-2 items-center">
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
                    className="prose prose-invert inline-block w-full overflow-hidden [&_*]:text-neutral-9 max-w-[560px]"
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
                  <button
                    onClick={copyLink}
                    className="min-w-16 text-[16px] font-bold flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-true-black rounded-[16px] cursor-pointer text-neutral-9  border border-neutral-9 hover:bg-neutral-9 hover:text-true-black transition-colors duration-300 ease-in-out"
                  >
                    <LinkIcon className="w-4 h-4" />
                    copy link
                  </button>
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
