import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { getChainFromId } from "@helpers/getChainFromId";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useSubmissionPageStore } from "../../store";

interface UseNavigateProposalsReturn {
  currentIndex: number;
  totalProposals: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextEntry?: () => void;
  handlePreviousEntry?: () => void;
  handleClose?: () => void;
  goToProposal?: (proposalId: string) => void;
}

const useNavigateProposals = (): UseNavigateProposalsReturn => {
  const router = useRouter();
  const { contestConfig, proposalId } = useContestConfigStore(useShallow(state => state));
  const proposalIds = useSubmissionPageStore(useShallow(state => state.allProposalIds));
  const chain = getChainFromId(contestConfig.chainId);

  const currentIndex = proposalIds.indexOf(proposalId);
  const totalProposals = proposalIds.length;
  const canGoNext = currentIndex !== -1 && currentIndex < totalProposals - 1;
  const canGoPrevious = currentIndex > 0;

  const goToProposal = (targetProposalId: string) => {
    const path = ROUTE_CONTEST_PROPOSAL.replace("[chain]", chain?.name.toLowerCase() ?? "")
      .replace("[address]", contestConfig.address)
      .replace("[submission]", targetProposalId);

    router.push(path, { scroll: false });
  };

  const handleNextEntry = () => {
    if (!canGoNext) return;
    const nextProposalId = proposalIds[currentIndex + 1];
    goToProposal(nextProposalId);
  };

  const handlePreviousEntry = () => {
    if (!canGoPrevious) return;
    const previousProposalId = proposalIds[currentIndex - 1];
    goToProposal(previousProposalId);
  };

  const handleClose = () => {
    router.push(`/contest/${chain?.name.toLowerCase() ?? ""}/${contestConfig.address}`, { scroll: false });
  };

  return {
    currentIndex: currentIndex,
    totalProposals: totalProposals,
    canGoNext: canGoNext,
    canGoPrevious: canGoPrevious,
    handleNextEntry,
    handlePreviousEntry,
    handleClose,
    goToProposal,
  };
};

export default useNavigateProposals;
