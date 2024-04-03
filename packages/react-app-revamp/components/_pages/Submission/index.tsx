import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import useFetchProposalData from "@hooks/useFetchProposalData";
import { useProposalStore } from "@hooks/useProposal/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { Abi } from "viem";
import SubmissionPageDesktopLayout from "./Desktop";
import SubmissionPageMobileLayout from "./Mobile";
interface SubmissionPageProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
    version: string;
    abi: Abi;
  };
  proposalId: string;
}

const SubmissionPage: FC<SubmissionPageProps> = ({ contestInfo, proposalId }) => {
  const {
    data: proposalData,
    loading: isProposalLoading,
    error: isProposalError,
  } = useFetchProposalData(contestInfo.abi, contestInfo.version, contestInfo.address, contestInfo.chainId, proposalId);
  const { contestPrompt: prompt } = useContestStore(state => state);
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const { openConnectModal } = useConnectModal();
  const { castVotes } = useCastVotes();
  const { listProposalsIds } = useProposalStore(state => state);

  const handleCastVotes = (amount: number, isUpvote: boolean) => {
    castVotes(amount, isUpvote);
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
    router.push(`/contest/${contestInfo.chain}/${contestInfo.address}`, { scroll: false });
  };

  const goToProposalPage = (chain: string, address: string, submission: string) => {
    const path = ROUTE_CONTEST_PROPOSAL.replace("[chain]", chain)
      .replace("[address]", address)
      .replace("[submission]", submission);

    router.push(path);
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
