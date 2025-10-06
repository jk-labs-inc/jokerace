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
  previousEntryUrl: string | null;
  nextEntryUrl: string | null;
  closeUrl: string;
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

  const buildProposalUrl = (targetProposalId: string): string => {
    return ROUTE_CONTEST_PROPOSAL.replace("[chain]", chain?.name.toLowerCase() ?? "")
      .replace("[address]", contestConfig.address)
      .replace("[submission]", targetProposalId);
  };

  const buildCloseUrl = (): string => {
    return `/contest/${chain?.name.toLowerCase() ?? ""}/${contestConfig.address}`;
  };

  const previousEntryUrl = canGoPrevious ? buildProposalUrl(proposalIds[currentIndex - 1]) : null;
  const nextEntryUrl = canGoNext ? buildProposalUrl(proposalIds[currentIndex + 1]) : null;
  const closeUrl = buildCloseUrl();

  const goToProposal = (targetProposalId: string) => {
    const path = buildProposalUrl(targetProposalId);
    router.push(path, { scroll: false });
  };

  return {
    currentIndex,
    totalProposals,
    canGoNext,
    canGoPrevious,
    previousEntryUrl,
    nextEntryUrl,
    closeUrl,
    goToProposal,
  };
};

export default useNavigateProposals;
