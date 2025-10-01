import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import { chains, config } from "@config/wagmi";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import { generateUrlSubmissions } from "@helpers/share";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import { VoteType } from "@hooks/useDeployContest/types";
import { useProposalStore } from "@hooks/useProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { switchChain } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION, ProposalData } from "lib/proposal";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SubmissionDeleteButton from "../components/Buttons/Delete";
import SubmissionDeleteModal from "../components/Modals/Delete";
import SubmissionPageMobileComments from "./components/Comments";
import SubmissionPageMobileAddFunds from "./components/AddFunds";
import StickyVoteFooter from "./components/VoteFooter";
import SubmissionPageMobileVotersList from "./components/VotersList";
import { useProposalVoters } from "@hooks/useProposalVoters";
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
  onVote?: (amount: number) => void;
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
  const { isConnected, address: userAddress, chainId: userChainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { contestStatus } = useContestStatusStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const { charge, contestAuthorEthereumAddress } = useContestStore(state => state);
  const isPayPerVote = charge.voteType === VoteType.PerVote;
  const { listProposalsIds } = useProposalStore(state => state);
  const stringifiedProposalsIds = listProposalsIds.map(id => id.toString());
  const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
  const totalProposals = listProposalsIds.length;
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const commentsAllowed = compareVersions(contestInfo.version, COMMENTS_VERSION) == -1 ? false : true;
  const chainCurrencySymbol = chains.find(chain => chain.id === contestInfo.chainId)?.nativeCurrency?.symbol;
  const { addressesVoted } = useProposalVoters(contestInfo.address, proposalId, contestInfo.chainId);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const isVotingOpen = contestStatus === ContestStatus.VotingOpen;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    canDeleteProposal,
    deleteProposal,
    isLoading: isDeleteLoading,
    isSuccess: isDeleteSuccess,
  } = useDeleteProposal();
  const allowDelete = canDeleteProposal(
    userAddress,
    contestAuthorEthereumAddress,
    proposalData?.proposal?.authorEthereumAddress ?? "",
    contestStatus,
  );
  const isUserOnCorrectChain = userChainId === contestInfo.chainId;

  useEffect(() => {
    if (isDeleteSuccess) {
      onClose?.();
    }
  }, [isDeleteSuccess, onClose]);

  const handleDeleteProposal = async () => {
    setIsDeleteModalOpen(false);

    if (!isUserOnCorrectChain) {
      await switchChain(config, { chainId: contestInfo.chainId });
    }
    await deleteProposal([proposalId]);
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
    <div className="fixed inset-0 z-50 bg-true-black overflow-y-auto px-8">
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
          <p className="loadingDots font-sabo-filled text-[18px] mt-12 text-neutral-9">loading submission info</p>
        ) : (
          <div className="animate-reveal flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {proposalData?.proposal ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <UserProfileDisplay
                      ethereumAddress={proposalData.proposal.authorEthereumAddress}
                      shortenOnFallback={true}
                      textColor="text-neutral-9"
                    />
                    {allowDelete && <SubmissionDeleteButton onClick={() => setIsDeleteModalOpen(true)} />}
                  </div>

                  {proposalData.proposal.rank > 0 && (
                    <div className="flex gap-2 items-center">
                      <p className="text-[16px] font-bold text-neutral-11">
                        {ordinalize(proposalData.proposal.rank).label} place{" "}
                        {proposalData.proposal.isTied ? "(tied)" : ""}
                      </p>
                      <span className="text-neutral-9">&#8226;</span>{" "}
                      <p className="text-[16px] font-bold text-neutral-9">
                        {formatNumberAbbreviated(proposalData.proposal.votes)} vote
                        {proposalData.proposal.votes > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            {proposalData?.proposal ? (
              <ContestProposal
                proposal={proposalData.proposal}
                contestStatus={contestStatus}
                className="text-neutral-9"
              />
            ) : (
              <p className="text-[16px] text-negative-11 font-bold">
                ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
              </p>
            )}

            {proposalData && proposalData.proposal && proposalData.proposal.votes > 0 && (
              <SubmissionPageMobileVotersList proposalId={proposalId} addressesVoted={addressesVoted} />
            )}

            {commentsAllowed && proposalData ? (
              <SubmissionPageMobileComments
                proposalId={proposalId}
                numberOfComments={proposalData.numberOfComments}
                address={contestInfo.address}
                chainId={contestInfo.chainId}
              />
            ) : null}
          </div>
        )}

        <div>
          <div
            className={`${totalProposals > 1 ? "fixed" : "hidden"} ${
              isInPwaMode ? "bottom-[88px]" : "bottom-12"
            } left-0 right-0 flex ${
              currentIndex === 0 || currentIndex === totalProposals - 1 ? "justify-center" : "justify-between"
            } px-8 pt-4 pb-8 z-50 border-t-neutral-2 border-t-2 bg-true-black`}
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

      {/* {showVotingModal && (
        <SubmissionPageMobileVoting
          isOpen={showVotingModal}
          onClose={() => setShowVotingModal(false)}
          proposalId={proposalId}
          amountOfVotes={currentUserAvailableVotesAmount}
          onVote={onVote}
          charge={charge}
          isPayPerVote={isPayPerVote}
          currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
          contestInfo={contestInfo}
        />
      )} */}

      {showAddFunds && (
        <SubmissionPageMobileAddFunds
          chain={contestInfo.chain}
          asset={chainCurrencySymbol ?? ""}
          isOpen={showAddFunds}
          onClose={() => setShowAddFunds(false)}
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
          onAddFunds={() => {
            setShowAddFunds(true);
          }}
        />
      )}
      {isDeleteModalOpen && (
        <SubmissionDeleteModal
          isDeleteProposalModalOpen={isDeleteModalOpen}
          setIsDeleteProposalModalOpen={setIsDeleteModalOpen}
          onClick={handleDeleteProposal}
        />
      )}
    </div>
  );
};

export default SubmissionPageMobileLayout;
