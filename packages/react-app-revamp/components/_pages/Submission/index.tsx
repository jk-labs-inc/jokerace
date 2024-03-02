import { goToProposalPage } from "@helpers/routing";
import useCastVotes from "@hooks/useCastVotes";
import { useProposalStore } from "@hooks/useProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ProposalData } from "lib/proposal";
import { useRouter } from "next/router";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import SubmissionPageDesktopLayout from "./Desktop";
import SubmissionPageMobileLayout from "./Mobile";
interface SubmissionPageProps {
  contestInfo: {
    address: string;
    chain: string;
    version: string;
  };
  isProposalLoading: boolean;
  isProposalError: boolean;
  proposalData: ProposalData | null;
  proposalId: string;
  prompt: string;
}

const SubmissionPage: FC<SubmissionPageProps> = ({
  contestInfo,
  prompt,
  proposalData,
  proposalId,
  isProposalLoading,
  isProposalError,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const { openConnectModal } = useConnectModal();
  const { castVotes } = useCastVotes();
  const { listProposalsIds } = useProposalStore(state => state);
  const {
    decreaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserVotesOnProposal,
    increaseCurrentUserTotalVotesCast,
    decreaseCurrentUserTotalVotesCast,
    decreaseCurrentUserVotesOnProposal,
  } = useUserStore(state => state);

  const handleCastVotes = (amount: number, isUpvote: boolean) => {
    decreaseCurrentUserAvailableVotesAmount(amount);
    increaseCurrentUserTotalVotesCast(amount);
    increaseCurrentUserVotesOnProposal(amount);

    castVotes(amount, isUpvote).catch(error => {
      increaseCurrentUserAvailableVotesAmount(amount);
      decreaseCurrentUserTotalVotesCast(amount);
      decreaseCurrentUserVotesOnProposal(amount);
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
    router.push(`/contest/${contestInfo.chain}/${contestInfo.address}`, undefined, { shallow: true, scroll: false });
  };

  const handleOnNextEntryChange = () => {
    const currentIndex = listProposalsIds.indexOf(proposalId);
    if (currentIndex !== -1 && currentIndex < listProposalsIds.length - 1) {
      const nextProposalId = listProposalsIds[currentIndex + 1];
      goToProposalPage(contestInfo.chain, contestInfo.address, nextProposalId);
    }
  };

  const handleOnPreviousEntryChange = () => {
    const currentIndex = listProposalsIds.indexOf(proposalId);
    if (currentIndex > 0) {
      const previousProposalId = listProposalsIds[currentIndex - 1];
      goToProposalPage(contestInfo.chain, contestInfo.address, previousProposalId);
    }
  };

  const layoutProps = {
    contestInfo,
    prompt,
    proposalData,
    isProposalLoading,
    isProposalError,
    proposalId,
    onClose,
    onVote: handleCastVotes,
    onConnectWallet,
    onPreviousEntry: handleOnPreviousEntryChange,
    onNextEntry: handleOnNextEntryChange,
  };

  if (isMobile) {
    return <SubmissionPageMobileLayout {...layoutProps} />;
  }

  return <SubmissionPageDesktopLayout {...layoutProps} />;
};

export default SubmissionPage;
