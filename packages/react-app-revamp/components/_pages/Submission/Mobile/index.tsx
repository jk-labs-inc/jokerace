import Comments from "@components/Comments";
import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import ListProposalVotes from "@components/_pages/ListProposalVotes";
import { LINK_BRIDGE_DOCS } from "@config/links";
import { chains } from "@config/wagmi";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import ordinalize from "@helpers/ordinalize";
import { generateUrlSubmissions } from "@helpers/share";
import { getTotalCharge } from "@helpers/totalCharge";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { useProposalStore } from "@hooks/useProposal/store";
import { useProposalVotes } from "@hooks/useProposalVotes";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION, ProposalData } from "lib/proposal";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import SubmissionPageMobileVoting from "./components/Voting";
import StickyVoteFooter from "./components/VoteFooter";

interface SubmissionPageMobileLayoutProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
    version: string;
  };
  proposalId: string;
  prompt: string;
  proposalData: ProposalData | null;
  isProposalLoading: boolean;
  isProposalError: boolean;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
  onConnectWallet?: () => void;
}

const SubmissionPageMobileLayout: FC<SubmissionPageMobileLayoutProps> = ({
  contestInfo,
  proposalId,
  prompt,
  proposalData,
  isProposalLoading,
  isProposalError,
  onClose,
  onVote,
  onPreviousEntry,
  onNextEntry,
  onConnectWallet,
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { contestStatus } = useContestStatusStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const { downvotingAllowed, charge } = useContestStore(state => state);
  const isPayPerVote = charge?.voteType === VoteType.PerVote;
  const { listProposalsIds } = useProposalStore(state => state);
  const stringifiedProposalsIds = listProposalsIds.map(id => id.toString());
  const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
  const totalProposals = listProposalsIds.length;
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const commentsAllowed = compareVersions(contestInfo.version, COMMENTS_VERSION) == -1 ? false : true;
  const chainCurrencySymbol = chains.find(chain => chain.id === contestInfo.chainId)?.nativeCurrency?.symbol;
  const { addressesVoted } = useProposalVotes(contestInfo.address, proposalId, contestInfo.chainId);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const isVotingOpen = contestStatus === ContestStatus.VotingOpen;

  if (isProposalError) {
    return (
      <div className="fixed inset-0 z-50 bg-true-black overflow-y-auto">
        <p className="text-[16px] text-negative-11 font-bold p-4">
          ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-true-black overflow-y-auto px-10">
      <div className={`flex justify-between ${isInPwaMode ? "mt-0" : "mt-8"}`}>
        <ArrowLeftIcon width={24} onClick={onClose} />
        <div className="flex self-end">
          <div
            className={`flex items-center bg-true-black rounded-full border-neutral-11 border overflow-hidden w-8 h-8`}
            onClick={() =>
              navigator.share({
                url: generateUrlSubmissions(contestInfo.address, contestInfo.chain, proposalId),
              })
            }
          >
            <img src="/forward.svg" alt="share" className="object-cover m-auto" width={15} height={13} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-5 pb-32">
        <ContestPrompt type="modal" prompt={prompt} hidePrompt />
        {isProposalLoading ? (
          <p className="loadingDots font-sabo text-[18px] mt-12 text-neutral-9">loading submission info</p>
        ) : (
          <div className="animate-reveal flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {proposalData?.proposal ? (
                <div className="flex flex-col gap-2">
                  <UserProfileDisplay
                    ethereumAddress={proposalData.proposal.authorEthereumAddress}
                    shortenOnFallback={true}
                  />
                  {proposalData.proposal.rank > 0 && (
                    <div className="flex gap-2 items-center">
                      <p className="text-[16px] font-bold text-neutral-11">
                        {formatNumberAbbreviated(proposalData.proposal.votes)} vote
                        {proposalData.proposal.votes > 1 ? "s" : ""}
                      </p>
                      <span className="text-neutral-9">&#8226;</span>{" "}
                      <p className="text-[16px] font-bold text-neutral-9">
                        {ordinalize(proposalData.proposal.rank).label} place{" "}
                        {proposalData.proposal.isTied ? "(tied)" : ""}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            {proposalData?.proposal ? (
              <ContestProposal proposal={proposalData.proposal} contestStatus={contestStatus} />
            ) : (
              <p className="text-[16px] text-negative-11 font-bold">
                ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
              </p>
            )}

            {proposalData && proposalData.proposal && proposalData.proposal.votes > 0 && (
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-11 font-bold">
                    voters {addressesVoted.length > 0 ? `(${addressesVoted.length})` : ""}
                  </p>
                  <ListProposalVotes proposalId={proposalId} votedAddresses={proposalData.votedAddresses} />
                </div>
              </div>
            )}

            {commentsAllowed && proposalData ? (
              <div className="flex flex-col gap-4">
                <p className="text-[20px] text-neutral-11 font-bold">
                  comments{proposalData?.numberOfComments ? ` (${proposalData.numberOfComments})` : ""}
                </p>
                <Comments
                  contestAddress={contestInfo.address}
                  contestChainId={contestInfo.chainId}
                  proposalId={proposalId}
                  numberOfComments={proposalData?.numberOfComments}
                />
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-20">
          <div
            className={`${totalProposals > 1 ? "fixed" : "hidden"} ${
              isInPwaMode ? "bottom-[88px]" : "bottom-12"
            } left-0 right-0 flex ${
              currentIndex === 0 || currentIndex === totalProposals - 1 ? "justify-center" : "justify-between"
            } px-8 pt-4 pb-4 z-50 border-t-neutral-2 border-t-2 bg-true-black`}
          >
            {currentIndex !== 0 && (
              <div
                className="flex items-center justify-center gap-2 text-positive-11 text-[16px] font-bold transform transition-transform duration-200 active:scale-95"
                onClick={onPreviousEntry}
              >
                <img
                  src="/contest/previous-entry-mobile.svg"
                  alt="prev-entry"
                  width={16}
                  height={16}
                  className="mt-1"
                />
                previous entry
              </div>
            )}
            {currentIndex !== totalProposals - 1 && (
              <div
                className="flex items-center justify-center gap-2 text-positive-11 text-[16px] font-bold transform transition-transform duration-200 active:scale-95"
                onClick={onNextEntry}
              >
                next entry
                <img src="/contest/next-entry-mobile.svg" alt="prev-entry" width={16} height={16} className="mt-1" />
              </div>
            )}
          </div>
          <MainHeaderMobileLayout
            isConnected={isConnected}
            address={contestInfo.address}
            openConnectModal={openConnectModal}
          />
        </div>
      </div>

      {showVotingModal && charge && (
        <SubmissionPageMobileVoting
          isOpen={showVotingModal}
          onClose={() => setShowVotingModal(false)}
          proposalId={proposalId}
          amountOfVotes={currentUserAvailableVotesAmount}
          onVote={(amount, isUpvote) => onVote?.(amount, isUpvote)}
          downvoteAllowed={downvotingAllowed}
          charge={charge}
          isPayPerVote={isPayPerVote}
          currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
          contestInfo={contestInfo}
        />
      )}

      {isVotingOpen && (
        <StickyVoteFooter
          isConnected={isConnected}
          totalProposals={totalProposals}
          currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
          outOfVotes={outOfVotes}
          isPayPerVote={isPayPerVote}
          contestInfo={contestInfo}
          chainCurrencySymbol={chainCurrencySymbol ?? ""}
          onConnectWallet={onConnectWallet ?? (() => {})}
          setShowVotingModal={setShowVotingModal}
          linkBridgeDocs={LINK_BRIDGE_DOCS}
        />
      )}
    </div>
  );
};

export default SubmissionPageMobileLayout;
