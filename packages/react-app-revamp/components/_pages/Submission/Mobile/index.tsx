import EthereumAddress from "@components/UI/EtheuremAddress";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Proposal";
import ListProposalVotes from "@components/_pages/ListProposalVotes";
import { Proposal } from "@components/_pages/ProposalContent";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { ProposalVotesWrapper } from "@hooks/useProposalVotes/store";
import { useUserStore } from "@hooks/useUser/store";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useAccount } from "wagmi";

interface SubmissionPageMobileLayoutProps {
  proposalId: string;
  prompt: string;
  proposal: Proposal;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onConnectWallet?: () => void;
  onSwipe?: (proposalId: string) => void;
}

const SubmissionPageMobileLayout: FC<SubmissionPageMobileLayoutProps> = ({
  proposalId,
  prompt,
  proposal,
  onClose,
  onVote,
  onConnectWallet,
  onSwipe,
}) => {
  const { isConnected } = useAccount();
  const { listProposalsIds } = useProposalStore(state => state);
  const { contestStatus } = useContestStatusStore(state => state);
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const [currentIdx, setCurrentIdx] = useState(0);
  const handlers = useSwipeable({
    onSwipedLeft: async () => {
      if (currentIdx > 0) {
        const newIdx = currentIdx - 1;
        onSwipe?.(listProposalsIds[newIdx]);
        setCurrentIdx(newIdx);
      }
    },
    onSwipedRight: async () => {
      console.log(currentIdx, listProposalsIds.length - 1);
      if (currentIdx < listProposalsIds.length - 1) {
        const newIdx = currentIdx + 1;
        onSwipe?.(listProposalsIds[newIdx]);
        setCurrentIdx(newIdx);
      }
    },
  });

  console.log(listProposalsIds);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;

  useEffect(() => {
    const idx = listProposalsIds.indexOf(proposalId);
    if (idx !== -1) {
      setCurrentIdx(idx);
    }
  }, [proposalId, listProposalsIds]);

  return (
    <div
      {...handlers}
      className="fixed top-0 left-0 right-0 bottom-0 z-10 bg-true-black overflow-y-auto w-screen -ml-6 mt-7 px-9"
    >
      <div className="flex justify-between">
        <ArrowLeftIcon width={24} onClick={onClose} />
        <div className="flex gap-2 self-end">
          <div className={`flex items-center  bg-neutral-12 rounded-full overflow-hidden w-8 h-8`}>
            <Image
              width={32}
              height={32}
              className="object-cover grayscale"
              src="/socials/lens-leaf.svg"
              alt="avatar"
            />
          </div>
          <div className={`flex items-center  bg-neutral-13 rounded-full overflow-hidden w-8 h-8`}>
            <Image
              width={28}
              height={28}
              className="object-cover m-auto"
              src="/socials/twitter-light.svg"
              alt="avatar"
            />
          </div>
          <div
            className={`flex items-center  bg-true-black rounded-full border-neutral-11 border overflow-hidden w-8 h-8`}
          >
            <Image src="/forward.svg" alt="share" className="object-cover m-auto" width={15} height={13} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-9">
        <div className="flex flex-col gap-4">
          <ContestPrompt type="modal" prompt={prompt} hidePrompt />
          <EthereumAddress ethereumAddress={proposal.authorEthereumAddress} shortenOnFallback={true} />
        </div>
        <ContestProposal proposal={proposal} collapsible={false} contestStatus={contestStatus} />
        <div className="flex flex-col gap-8">
          {contestStatus === ContestStatus.VotingOpen && (
            <>
              <p className="text-neutral-11 text-[24px] font-bold">add votes</p>
              {isConnected ? (
                currentUserAvailableVotesAmount > 0 ? (
                  <VotingWidget amountOfVotes={currentUserAvailableVotesAmount} onVote={onVote} />
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
          {proposal.votes > 0 && (
            <ProposalVotesWrapper>
              <ListProposalVotes proposalId={proposalId} />
            </ProposalVotesWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageMobileLayout;
