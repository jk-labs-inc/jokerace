import Comments from "@components/Comments";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import { chains } from "@config/wagmi";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { useProposalStore } from "@hooks/useProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION, ProposalData } from "lib/proposal";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ListProposalVotes from "../ListProposalVotes";
import { LINK_BRIDGE_DOCS } from "@config/links";
import EntryNavigation from "./components/EntryNavigation";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

interface DialogModalProposalProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
    version: string;
  };
  isOpen: boolean;
  prompt: string;
  proposalId: string;
  proposalData: ProposalData | null;
  isProposalLoading: boolean;
  isProposalError: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
  onConnectWallet?: () => void;
}

const DialogModalProposal: FC<DialogModalProposalProps> = ({
  contestInfo,
  isOpen,
  setIsOpen,
  prompt,
  proposalData,
  proposalId,
  isProposalLoading,
  isProposalError,
  onClose,
  onVote,
  onPreviousEntry,
  onNextEntry,
  onConnectWallet,
}) => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { isConnected } = useAccount();
  const { isSuccess } = useCastVotes();
  const { listProposalsIds } = useProposalStore(state => state);
  const stringifiedProposalsIds = listProposalsIds.map(id => id.toString());
  const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
  const totalProposals = listProposalsIds.length;
  const { downvotingAllowed, charge } = useContestStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const commentsAllowed = compareVersions(contestInfo.version, COMMENTS_VERSION) == -1 ? false : true;
  const chainCurrencySymbol = chains.find(chain => chain.id === contestInfo.chainId)?.nativeCurrency?.symbol;
  const isAnyoneCanVote = charge?.voteType === VoteType.PerVote;
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    if (isSuccess) setIsOpen?.(false);
  }, [isSuccess, setIsOpen]);

  if (isProposalError) {
    return (
      <DialogModalV3
        title="Proposal"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="xl:w-[1000px] 3xl:w-[1200px]"
        onClose={onClose}
      >
    æ    <div
          className="flex flex-col gap-8 md:pl-[50px] lg:pl-[100px] mt-[20px] md:mt-[60px] pb-[60px]"
          id="custom-modal"
        >
          <p className="text-[16px] text-negative-11 font-bold">
            ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
          </p>
        </div>
      </DialogModalV3>
    );
  }

  return (
    <DialogModalV3 title="Proposal" isOpen={isOpen} setIsOpen={setIsOpen} className="w-[1200px]" onClose={onClose}>
      <div className="flex flex-col h-full" id="custom-modal">
        <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-2">
          {isProposalLoading ? (
            <p className="loadingDots font-sabo text-[18px] text-neutral-9">loading submission info</p>
          ) : proposalData?.proposal ? (
            <>
              <div className="flex items-center gap-4">
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
                    <span className="text-neutral-9">•</span>
                    <p className="text-[16px] font-bold text-neutral-9">
                      {ordinalize(proposalData.proposal.rank).label} place{" "}
                      {proposalData.proposal.isTied ? "(tied)" : ""}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {totalProposals > 1 && (
                  <EntryNavigation
                    currentIndex={currentIndex}
                    totalProposals={totalProposals}
                    isProposalLoading={isProposalLoading}
                    onPreviousEntry={onPreviousEntry}
                    onNextEntry={onNextEntry}
                  />
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex flex-1">
          <div className="flex-1">
            <div className="h-[calc(90vh-180px)] overflow-y-auto">
              <div className="p-8">
                {proposalData?.proposal && (
                  <ContestProposal
                    proposal={proposalData.proposal}
                    contestStatus={contestStatus}
                    proposalId={proposalId}
                    displaySocials
                  />
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="px-2 hover:bg-neutral-2 transition-colors"
          >
            <ChevronRightIcon className={`w-4 h-4 transition-transform ${isSidebarVisible ? "rotate-180" : ""}`} />
          </button>

          <div
            className={`transition-all duration-300 border-l border-neutral-2 flex flex-col
              ${isSidebarVisible ? "w-[300px]" : "w-0 overflow-hidden"}`}
          >
            <div className="h-1/2 overflow-y-auto">
              <div className="p-4">
                {proposalData && proposalData.proposal && proposalData.proposal.votes > 0 && (
                  <ListProposalVotes proposalId={proposalId} votedAddresses={proposalData.votedAddresses} />
                )}
              </div>
            </div>

            <div className="h-1/2 overflow-y-auto border-t border-neutral-2">
              <div className="p-4">
                {commentsAllowed && proposalData && (
                  <Comments
                    contestAddress={contestInfo.address}
                    contestChainId={contestInfo.chainId}
                    proposalId={proposalId}
                    numberOfComments={proposalData?.numberOfComments}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {contestStatus === ContestStatus.VotingOpen && (
          <div className="border-t border-neutral-2 p-4">
            {isConnected ? (
              currentUserAvailableVotesAmount > 0 ? (
                <VotingWidget
                  proposalId={proposalId}
                  amountOfVotes={currentUserAvailableVotesAmount}
                  onVote={onVote}
                  downvoteAllowed={downvotingAllowed}
                />
              ) : outOfVotes ? (
                <p className="text-[16px] text-neutral-11">
                  looks like you've used up all your votes this contest <br />
                  feel free to try connecting another wallet to see if it has more votes!
                </p>
              ) : isAnyoneCanVote ? (
                <a href={LINK_BRIDGE_DOCS} target="_blank" className="text-[16px] text-negative-11 font-bold underline">
                  add {chainCurrencySymbol} to {contestInfo.chain} to get votes
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
      </div>
    </DialogModalV3>
  );
};

export default DialogModalProposal;
