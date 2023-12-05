/* eslint-disable react-hooks/exhaustive-deps */
import Comments from "@components/Comments";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import { chains } from "@config/wagmi";
import { ChevronUpIcon } from "@heroicons/react/outline";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useContractVersion from "@hooks/useContractVersion";
import { useProposalStore } from "@hooks/useProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ListProposalVotes from "../ListProposalVotes";
import { Proposal } from "../ProposalContent";
import { formatNumber } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";

const COMMENTS_VERSION = 4.11;

interface DialogModalProposalProps {
  contestInfo: {
    address: string;
    chain: string;
    version: number;
  };
  isOpen: boolean;
  prompt: string;
  proposalId: string;
  proposal: Proposal | null;
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
  proposal,
  proposalId,
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
  const { downvotingAllowed } = useContestStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === contestInfo.chain)?.[0]?.id;
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const commentsAllowed = contestInfo.version >= COMMENTS_VERSION;

  useEffect(() => {
    if (isSuccess) setIsOpen?.(false);
  }, [isSuccess, setIsOpen]);

  return (
    <DialogModalV3
      title="Proposal"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="xl:w-[1110px] 3xl:w-[1300px]"
      onClose={onClose}
    >
      <div
        className="flex flex-col gap-8 md:pl-[50px] lg:pl-[100px] mt-[20px] md:mt-[60px] pb-[60px]"
        id="custom-modal"
      >
        <ContestPrompt type="modal" prompt={prompt} hidePrompt />
        <div className={`${totalProposals > 1 ? "flex" : "hidden"} gap-4`}>
          {currentIndex !== 0 && (
            <ButtonV3
              colorClass="bg-primary-2"
              textColorClass="flex items-center justify-center gap-2 text-neutral-11 text-[16px] font-bold rounded-[40px] group transform transition-transform duration-200 active:scale-95"
              size={ButtonSize.LARGE}
              onClick={onPreviousEntry}
            >
              <div className="transition-transform duration-200 group-hover:-translate-x-1">
                <Image src="/contest/previous-entry.svg" alt="prev-entry" width={16} height={14} className="mt-1" />
              </div>
              previous entry
            </ButtonV3>
          )}
          {currentIndex !== totalProposals - 1 && (
            <ButtonV3
              colorClass="bg-primary-2"
              textColorClass="flex items-center justify-center gap-2 text-neutral-11 text-[16px] font-bold rounded-[40px] group transform transition-transform duration-200 active:scale-95"
              size={ButtonSize.LARGE}
              onClick={onNextEntry}
            >
              next entry
              <div className="transition-transform duration-200 group-hover:translate-x-1">
                <Image src="/contest/next-entry.svg" alt="prev-entry" width={16} height={14} className="mt-[3px]" />
              </div>
            </ButtonV3>
          )}
        </div>

        {proposal ? (
          <div className="flex flex-col gap-4">
            {proposal.rank > 0 && (
              <div className="flex gap-2 items-center">
                <p className="text-[16px] font-bold text-neutral-11">
                  {formatNumber(proposal.votes)} vote{proposal.votes > 1 ? "s" : ""}
                </p>
                <span className="text-neutral-11">&#8226;</span>{" "}
                <p className="text-[16px] font-bold text-neutral-11">
                  {ordinalize(proposal.rank).label} place {proposal.isTied ? "(tied)" : ""}
                </p>
              </div>
            )}
            <EthereumAddress ethereumAddress={proposal.authorEthereumAddress} shortenOnFallback={true} />
          </div>
        ) : null}

        {proposal ? (
          <ContestProposal proposal={proposal} contestStatus={contestStatus} proposalId={proposalId} displaySocials />
        ) : (
          <p className="text-[16px] text-negative-11 font-bold">
            ruh-roh! An error occurred when retrieving this proposal; try refreshing the page.
          </p>
        )}
        <div className="flex flex-col gap-8">
          {contestStatus === ContestStatus.VotingOpen && (
            <>
              <p className="text-neutral-11 text-[24px] font-bold">vote</p>
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
          {proposal && proposal.votes > 0 && <ListProposalVotes proposalId={proposalId} />}
        </div>
        {commentsAllowed ? (
          <div className="flex flex-col gap-12">
            <div className="flex gap-1 md:gap-4 items-center">
              <p className="text-[24px] text-neutral-11 font-bold">comments</p>

              <button
                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                className={`transition-transform duration-500 ease-in-out transform ${
                  isCommentsOpen ? "" : "rotate-180"
                }`}
              >
                <ChevronUpIcon height={30} />
              </button>
            </div>
            {isCommentsOpen ? (
              <Comments contestAddress={contestInfo.address} contestChainId={chainId} proposalId={proposalId} />
            ) : null}
          </div>
        ) : null}
      </div>
    </DialogModalV3>
  );
};

export default DialogModalProposal;
