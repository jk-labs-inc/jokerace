import Comments from "@components/Comments";
import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
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
  const [showMaxVoteConfirmation, setShowMaxVoteConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ amount: number; isUpvote: boolean } | null>(null);
  const [totalCharge, setTotalCharge] = useState("");
  const nativeToken = getNativeTokenSymbol(contestInfo.chain);

  const onSubmitCastVotes = (amount: number, isUpvote: boolean) => {
    if (amount === currentUserAvailableVotesAmount && isPayPerVote) {
      setShowMaxVoteConfirmation(true);
      setPendingVote({ amount, isUpvote });
      setTotalCharge(getTotalCharge(amount, charge?.type.costToVote ?? 0));
      return;
    }

    onVote?.(amount, isUpvote);
  };

  const confirmMaxVote = () => {
    if (pendingVote) {
      onVote?.(pendingVote.amount, pendingVote.isUpvote);
      setShowMaxVoteConfirmation(false);
      setPendingVote(null);
    }
  };

  const cancelMaxVote = () => {
    setShowMaxVoteConfirmation(false);
    setPendingVote(null);
  };

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
    <div className="fixed inset-0 z-50 bg-true-black overflow-y-auto">
      <div className={`flex justify-between p-4 ${isInPwaMode ? "mt-0" : "mt-8"}`}>
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
      <div className="flex flex-col gap-12 mt-5 px-4 pb-32">
        <ContestPrompt type="modal" prompt={prompt} hidePrompt />
        {isProposalLoading ? (
          <p className="loadingDots font-sabo text-[18px] mt-12 text-neutral-9">loading submission info</p>
        ) : (
          <div className="animate-reveal flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {proposalData?.proposal ? (
                <div className="flex gap-2 items-center">
                  <UserProfileDisplay
                    ethereumAddress={proposalData.proposal.authorEthereumAddress}
                    shortenOnFallback={true}
                  />
                  {proposalData.proposal.rank > 0 && (
                    <div className="flex gap-2 items-center">
                      <span className="text-neutral-11">&#8226;</span>{" "}
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

            {contestStatus === ContestStatus.VotingOpen && (
              <div className="flex flex-col gap-4 md:gap-8 md:w-80">
                <hr className="block border border-neutral-2" />
                {isConnected ? (
                  currentUserAvailableVotesAmount > 0 ? (
                    <VotingWidget
                      proposalId={proposalId}
                      amountOfVotes={currentUserAvailableVotesAmount}
                      onVote={onSubmitCastVotes}
                      downvoteAllowed={downvotingAllowed}
                    />
                  ) : outOfVotes ? (
                    <p className="text-[16px] text-neutral-11">
                      looks like you've used up all your votes this contest <br />
                      feel free to try connecting another wallet to see if it has more votes!
                    </p>
                  ) : isPayPerVote ? (
                    <a
                      href={LINK_BRIDGE_DOCS}
                      target="_blank"
                      className="text-[16px] text-positive-11 opacity-80 hover:opacity-100 transition-colors font-bold"
                    >
                      add {chainCurrencySymbol} to {contestInfo.chain} to get votes {">"}
                    </a>
                  ) : (
                    <p className="text-[16px] text-neutral-11">
                      unfortunately your wallet didn't qualify to vote in this contest <br />
                      feel free to try connecting another wallet!
                    </p>
                  )
                ) : (
                  <p className="text-[16px] text-neutral-11 font-bold">
                    <span className="text-positive-11 cursor-pointer text-[16px]" onClick={onConnectWallet}>
                      connect wallet
                    </span>{" "}
                    to see if you qualify
                  </p>
                )}
              </div>
            )}

            {proposalData && proposalData.proposal && proposalData.proposal.votes > 0 && (
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                  <p className="text-[24px] text-neutral-11 font-bold">
                    voters ({addressesVoted.length > 0 ? addressesVoted.length : null})
                  </p>
                  <ListProposalVotes proposalId={proposalId} votedAddresses={proposalData.votedAddresses} />
                </div>
              </div>
            )}

            {commentsAllowed && proposalData ? (
              <div className="flex flex-col gap-4">
                <p className="text-[24px] text-neutral-11 font-bold">
                  comments (
                  {proposalData.numberOfComments && proposalData.numberOfComments > 0
                    ? proposalData.numberOfComments
                    : null}
                  )
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
            } px-8 pt-5 pb-9 z-50 border-t-neutral-2 border-t-2 bg-true-black`}
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
      {showMaxVoteConfirmation && (
        <DialogMaxVotesAlert
          token={nativeToken ?? ""}
          totalCost={totalCharge}
          onConfirm={confirmMaxVote}
          onCancel={cancelMaxVote}
          isMobile={true}
        />
      )}
    </div>
  );
};

export default SubmissionPageMobileLayout;
