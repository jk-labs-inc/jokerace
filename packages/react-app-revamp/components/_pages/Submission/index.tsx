import { chains } from "@config/wagmi";
import useCastVotes from "@hooks/useCastVotes";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { Proposal } from "../ProposalContent";
import SubmissionPageDesktopLayout from "./Desktop";
import SubmissionPageMobileLayout from "./Mobile";
import { useProposalStore } from "@hooks/useProposal/store";
import { goToProposalPage } from "@helpers/routing";
import useProposalVotes from "@hooks/useProposalVotes";

interface SubmissionPageProps {
  chain: string;
  address: string;
  proposalId: string;
  prompt: string;
  proposal: Proposal;
}

const SubmissionPage: FC<SubmissionPageProps> = ({ chain: chainName, address, proposalId, prompt, proposal }) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const { openConnectModal } = useConnectModal();
  const { retry: refreshVotes } = useProposalVotes(proposalId);
  const { castVotes } = useCastVotes();
  const { listProposalsIds } = useProposalStore(state => state);
  const {
    decreaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserTotalVotesCast,
    decreaseCurrentUserTotalVotesCast,
  } = useUserStore(state => state);

  const handleCastVotes = (amount: number, isUpvote: boolean) => {
    decreaseCurrentUserAvailableVotesAmount(amount);
    increaseCurrentUserTotalVotesCast(amount);

    castVotes(amount, isUpvote).catch(error => {
      increaseCurrentUserAvailableVotesAmount(amount);
      decreaseCurrentUserTotalVotesCast(amount);
    });
  };

  async function requestAccount() {
    try {
      const accounts = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });
      return accounts?.[0];
    } catch (error) {
      console.error("User denied account access");
      return null;
    }
  }

  const onConnectWallet = async () => {
    await requestAccount();
    openConnectModal?.();
  };

  const onClose = () => {
    router.push(`/contest/${chainName}/${address}`, undefined, { shallow: true, scroll: false });
  };

  const handleOnNextEntryChange = () => {
    const stringifiedProposalsIds = listProposalsIds.map(id => id.toString()); // Convert BigInt to string
    const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
    if (currentIndex !== -1 && currentIndex < stringifiedProposalsIds.length - 1) {
      const nextProposalId = stringifiedProposalsIds[currentIndex + 1];
      refreshVotes();
      goToProposalPage(chainName, address, nextProposalId);
    }
  };

  const handleOnPreviousEntryChange = () => {
    const stringifiedProposalsIds = listProposalsIds.map(id => id.toString()); // Convert BigInt to string
    const currentIndex = stringifiedProposalsIds.indexOf(proposalId);
    if (currentIndex > 0) {
      const previousProposalId = stringifiedProposalsIds[currentIndex - 1];
      refreshVotes();
      goToProposalPage(chainName, address, previousProposalId);
    }
  };

  if (isMobile) {
    return (
      <SubmissionPageMobileLayout
        address={address}
        chain={chainName}
        prompt={prompt}
        proposal={proposal}
        proposalId={proposalId}
        onClose={onClose}
        onVote={handleCastVotes}
        onConnectWallet={onConnectWallet}
      />
    );
  }

  return (
    <SubmissionPageDesktopLayout
      prompt={prompt}
      proposal={proposal}
      proposalId={proposalId}
      onClose={onClose}
      onNextEntry={handleOnNextEntryChange}
      onPreviousEntry={handleOnPreviousEntryChange}
    />
  );
};

export default SubmissionPage;
