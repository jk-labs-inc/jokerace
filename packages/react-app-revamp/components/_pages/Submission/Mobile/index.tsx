import Comments from "@components/Comments";
import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import DialogModalV3 from "@components/UI/DialogModalV3";
import Loader from "@components/UI/Loader";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import ListProposalVotes from "@components/_pages/ListProposalVotes";
import { chains } from "@config/wagmi";
import { formatNumber } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import { generateUrlSubmissions } from "@helpers/share";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION, ProposalData } from "lib/proposal";
import Image from "next/image";
import { FC } from "react";
import { useAccount } from "wagmi";

interface SubmissionPageMobileLayoutProps {
  contestInfo: {
    address: string;
    chain: string;
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
  const { openAccountModal } = useAccountModal();
  const { contestStatus } = useContestStatusStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const { downvotingAllowed } = useContestStore(state => state);
  const { listProposalsIds } = useProposalStore(state => state);
  const stringifiedProposalsIds = listProposalsIds.map(id => id.toString());
  const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
  const totalProposals = listProposalsIds.length;
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const commentsAllowed = compareVersions(contestInfo.version, COMMENTS_VERSION) == -1 ? false : true;
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestInfo.chain,
  )?.[0]?.id;

  if (isProposalError) {
    return (
      <DialogModalV3 isOpen={true} title="submissionMobile" isMobile>
        <p className="text-[16px] text-negative-11 font-bold">
          ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
        </p>
      </DialogModalV3>
    );
  }

  return (
    <DialogModalV3 isOpen={true} title="submissionMobile" isMobile>
      <div className={`flex justify-between ${isInPwaMode ? "mt-0" : "mt-12"}`}>
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
            <Image src="/forward.svg" alt="share" className="object-cover m-auto" width={15} height={13} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-12 mt-9">
        <ContestPrompt type="modal" prompt={prompt} hidePrompt />
        {isProposalLoading ? (
          <p className="loadingDots font-sabo text-[18px] mt-12 text-neutral-9">loading submission info</p>
        ) : (
          <div className="animate-fadeIn flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {proposalData?.proposal ? (
                <div className="flex flex-col gap-4">
                  {proposalData.proposal.rank > 0 && (
                    <div className="flex gap-2 items-center">
                      <p className="text-[16px] font-bold text-neutral-11">
                        {formatNumber(proposalData.proposal.votes)} vote{proposalData.proposal.votes > 1 ? "s" : ""}
                      </p>
                      <span className="text-neutral-11">&#8226;</span>{" "}
                      <p className="text-[16px] font-bold text-neutral-11">
                        {ordinalize(proposalData.proposal.rank).label} place{" "}
                        {proposalData.proposal.isTied ? "(tied)" : ""}
                      </p>
                    </div>
                  )}
                  <UserProfileDisplay
                    ethereumAddress={proposalData.proposal.authorEthereumAddress}
                    shortenOnFallback={true}
                  />
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

            <div className="flex flex-col gap-12">
              {contestStatus === ContestStatus.VotingOpen && (
                <>
                  <p className="text-neutral-11 text-[24px] font-bold">add votes</p>
                  {isConnected ? (
                    currentUserAvailableVotesAmount > 0 ? (
                      <VotingWidget
                        amountOfVotes={currentUserAvailableVotesAmount}
                        onVote={onVote}
                        downvoteAllowed={downvotingAllowed}
                      />
                    ) : outOfVotes ? (
                      <p className="text-[16px] text-neutral-11">
                        looks like you’ve used up all your votes this contest <br />
                        feel free to try connecting another wallet to see if it has more votes!
                      </p>
                    ) : (
                      <p className="text-[16px] text-neutral-11">
                        unfortunately your wallet didn’t qualify to vote in this contest <br />
                        feel free to try connecting another wallet!
                      </p>
                    )
                  ) : (
                    <p className="text-[16px] font-bold text-neutral-11 mt-2">
                      <span className="text-positive-11 cursor-pointer" onClick={onConnectWallet}>
                        connect wallet
                      </span>{" "}
                      to see if you qualify
                    </p>
                  )}
                </>
              )}
              {proposalData && proposalData.proposal && proposalData.proposal.votes > 0 ? (
                <ListProposalVotes proposalId={proposalId} votedAddresses={proposalData.votedAddresses} />
              ) : null}
            </div>

            {commentsAllowed && proposalData ? (
              <Comments
                contestAddress={contestInfo.address}
                contestChainId={chainId}
                proposalId={proposalId}
                numberOfComments={proposalData?.numberOfComments}
              />
            ) : null}
          </div>
        )}

        <div className="mt-20">
          <div
            className={`${totalProposals > 1 ? "fixed" : "hidden"} ${
              isInPwaMode ? "bottom-[88px]" : "bottom-16"
            } left-0 right-0 flex ${
              currentIndex === 0 || currentIndex === totalProposals - 1 ? "justify-center" : "justify-between"
            } px-8 py-5 z-50 border-t-neutral-2 border-t-2 bg-true-black`}
          >
            {currentIndex !== 0 && (
              <div
                className="flex items-center justify-center gap-2 text-positive-11 text-[16px] font-bold transform transition-transform duration-200 active:scale-95"
                onClick={onPreviousEntry}
              >
                <Image
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
                <Image src="/contest/next-entry-mobile.svg" alt="prev-entry" width={16} height={16} className="mt-1" />
              </div>
            )}
          </div>
          <MainHeaderMobileLayout
            isConnected={isConnected}
            address={contestInfo.address}
            openAccountModal={openAccountModal}
            openConnectModal={openConnectModal}
          />
        </div>
      </div>
    </DialogModalV3>
  );
};

export default SubmissionPageMobileLayout;
