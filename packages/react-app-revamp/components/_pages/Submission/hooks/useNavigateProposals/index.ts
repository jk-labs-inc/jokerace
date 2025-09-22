import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import useCastVotes from "@hooks/useCastVotes";
import { useProposalStore } from "@hooks/useProposal/store";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface UseNavigateProposalsProps {
  contestInfo: {
    chain: string;
    address: string;
  };
  proposalId: string;
}

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

const useNavigateProposals = ({ contestInfo, proposalId }: UseNavigateProposalsProps): UseNavigateProposalsReturn => {
  const router = useRouter();
  const { listProposalsIds } = useProposalStore(state => state);

  const navigationState = useMemo(() => {
    const currentIndex = listProposalsIds.indexOf(proposalId);
    const totalProposals = listProposalsIds.length;
    const canGoNext = currentIndex !== -1 && currentIndex < totalProposals - 1;
    const canGoPrevious = currentIndex > 0;

    return {
      currentIndex,
      totalProposals,
      canGoNext,
      canGoPrevious,
    };
  }, [listProposalsIds, proposalId]);

  const goToProposal = (targetProposalId: string) => {
    const path = ROUTE_CONTEST_PROPOSAL.replace("[chain]", contestInfo.chain)
      .replace("[address]", contestInfo.address)
      .replace("[submission]", targetProposalId);

    router.push(path, { scroll: false });
  };

  const handleNextEntry = () => {
    if (!navigationState.canGoNext) return;
    const nextProposalId = listProposalsIds[navigationState.currentIndex + 1];
    goToProposal(nextProposalId);
  };

  const handlePreviousEntry = () => {
    if (!navigationState.canGoPrevious) return;
    const previousProposalId = listProposalsIds[navigationState.currentIndex - 1];
    goToProposal(previousProposalId);
  };

  const handleClose = () => {
    router.push(`/contest/${contestInfo.chain}/${contestInfo.address}`, { scroll: false });
  };

  return {
    currentIndex: navigationState.currentIndex,
    totalProposals: navigationState.totalProposals,
    canGoNext: navigationState.canGoNext,
    canGoPrevious: navigationState.canGoPrevious,
    handleNextEntry,
    handlePreviousEntry,
    handleClose,
    goToProposal,
  };
};

export default useNavigateProposals;
