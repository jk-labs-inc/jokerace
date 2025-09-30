import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { getProposalIdsRaw } from "@hooks/useProposal/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { shuffle } from "lodash";
import { formatEther } from "viem";
import { compareVersions } from "compare-versions";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";

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
  isLoading: boolean;
  handleNextEntry?: () => void;
  handlePreviousEntry?: () => void;
  handleClose?: () => void;
  goToProposal?: (proposalId: string) => void;
}

const useNavigateProposals = ({ contestInfo, proposalId }: UseNavigateProposalsProps): UseNavigateProposalsReturn => {
  const router = useRouter();
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));

  const {
    data: proposalIds = [],
    isLoading: isLoadingProposals,
    isError,
  } = useQuery({
    queryKey: ["proposalIds", contestInfo.address, contestInfo.chain],
    queryFn: async () => {
      const contractConfig = {
        address: contestConfig.address as `0x${string}`,
        abi: contestConfig.abi,
        chainId: contestConfig.chainId,
      };

      const useLegacyGetAllProposalsIdFn = compareVersions(contestConfig.version, "4.15") <= 0;

      const proposalsIdsRawData = await getProposalIdsRaw(
        contractConfig,
        useLegacyGetAllProposalsIdFn,
        contestConfig.version,
      );

      let proposalsIds: string[];

      if (!useLegacyGetAllProposalsIdFn) {
        const hasDownvotes = compareVersions(contestConfig.version, "5.1") < 0;

        const extractVotes = (index: number) => {
          if (hasDownvotes) {
            const forVotesValue = BigInt(proposalsIdsRawData[1][index].forVotes);
            const againstVotesValue = BigInt(proposalsIdsRawData[1][index].againstVotes);
            return Number(formatEther(forVotesValue - againstVotesValue));
          }
          return Number(formatEther(proposalsIdsRawData[1][index]));
        };

        const mappedProposals = proposalsIdsRawData[0].map((data: any, index: number) => ({
          votes: extractVotes(index),
          id: data.toString(),
        }));

        // Sort by votes (highest first)
        proposalsIds = [...mappedProposals]
          .sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes)
          .map((proposal: { id: any }) => proposal.id);
      } else {
        proposalsIds = proposalsIdsRawData as string[];
      }

      return proposalsIds;
    },
    enabled: !!(contestConfig.address && contestConfig.abi && contestConfig.chainId),
    refetchOnWindowFocus: false,
  });

  const currentIndex = proposalIds.indexOf(proposalId);
  const totalProposals = proposalIds.length;
  const canGoNext = currentIndex !== -1 && currentIndex < totalProposals - 1;
  const canGoPrevious = currentIndex > 0;

  const goToProposal = (targetProposalId: string) => {
    const path = ROUTE_CONTEST_PROPOSAL.replace("[chain]", contestInfo.chain)
      .replace("[address]", contestInfo.address)
      .replace("[submission]", targetProposalId);

    router.push(path, { scroll: false });
  };

  const handleNextEntry = () => {
    if (isLoadingProposals || isError || !canGoNext) return;
    const nextProposalId = proposalIds[currentIndex + 1];
    goToProposal(nextProposalId);
  };

  const handlePreviousEntry = () => {
    if (isLoadingProposals || isError || !canGoPrevious) return;
    const previousProposalId = proposalIds[currentIndex - 1];
    goToProposal(previousProposalId);
  };

  const handleClose = () => {
    router.push(`/contest/${contestInfo.chain}/${contestInfo.address}`, { scroll: false });
  };

  return {
    currentIndex: isLoadingProposals || isError || proposalIds.length === 0 ? -1 : currentIndex,
    totalProposals: isLoadingProposals || isError ? 0 : totalProposals,
    canGoNext: !isLoadingProposals && !isError && canGoNext,
    canGoPrevious: !isLoadingProposals && !isError && canGoPrevious,
    isLoading: isLoadingProposals,
    handleNextEntry,
    handlePreviousEntry,
    handleClose,
    goToProposal,
  };
};

export default useNavigateProposals;
