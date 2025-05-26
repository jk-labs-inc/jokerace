import { Distribution, Reward } from "@components/_pages/Contest/Rewards/types";
import { extractPathSegments } from "@helpers/extractPath";
import { getNativeTokenInfo } from "@helpers/getNativeTokenInfo";
import { useQuery } from "@tanstack/react-query";
import { fetchClaimableRewards, fetchClaimedRewards } from "lib/rewards";
import { ModuleType } from "lib/rewards/types";
import { calculateTotalRewards } from "lib/rewards/utils";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Abi } from "viem";

export interface RewardsParams {
  moduleType: ModuleType;
  contractAddress: `0x${string}`;
  chainId: number;
  abi: Abi;
  voterAddress: `0x${string}`;
  rankings: number[];
  creatorAddress?: `0x${string}`;
  version: string;
  claimableEnabled?: boolean;
  claimedEnabled?: boolean;
}

export interface RewardsResult {
  claimable: {
    distributions: Distribution[];
  };
  claimed: {
    distributions: Distribution[];
  };
  totalRewards: Reward[];
  isLoading: boolean;
  refetch: () => void;
}

/**
 * Main hook for fetching user rewards (claimable and claimed)
 * @param moduleType - The module type
 * @param contractAddress - The rewards module address
 * @param chainId - The chainId of the rewards module
 * @param abi - The abi of the rewards module
 * @param voterAddress - The address of the user
 * @param rankings - The rankings of the user
 * @param creatorAddress - The address of the creator (needed for tied rankings)
 * @param claimableEnabled - Whether the claimable rewards are enabled
 * @param claimedEnabled - Whether the claimed rewards are enabled
 */
const useUserRewards = ({
  moduleType,
  contractAddress,
  chainId,
  abi,
  voterAddress,
  rankings,
  creatorAddress,
  version,
  claimableEnabled = true,
  claimedEnabled = true,
}: RewardsParams): RewardsResult => {
  const asPath = usePathname();
  const { chainName: contestChainName } = extractPathSegments(asPath ?? "");
  const nativeTokenInfo = getNativeTokenInfo(chainId);

  const commonQueryParams = {
    moduleType,
    contractAddress,
    chainId,
    abi,
    voterAddress,
    rankings,
    creatorAddress,
    contestChainName,
    nativeTokenInfo,
    version,
  };

  const {
    data: claimableData,
    isLoading: isClaimableLoading,
    refetch: refetchClaimable,
  } = useQuery({
    queryKey: ["claimableRewards", contractAddress, chainId, voterAddress, creatorAddress, rankings],
    queryFn: () => fetchClaimableRewards(commonQueryParams),
    enabled: claimableEnabled && !!contractAddress && !!voterAddress && rankings.length > 0,
  });

  const {
    data: claimedData,
    isLoading: isClaimedLoading,
    refetch: refetchClaimed,
  } = useQuery({
    queryKey: ["claimedRewards", contractAddress, chainId, voterAddress, creatorAddress, rankings],
    queryFn: () => fetchClaimedRewards(commonQueryParams),
    enabled: claimedEnabled && !!contractAddress && !!voterAddress && rankings.length > 0,
  });

  const totalRewards = useMemo(() => {
    if (!claimableData && !claimedData) return [];
    const allDistributions = [...(claimableData || []), ...(claimedData || [])];
    return calculateTotalRewards(allDistributions);
  }, [claimableData, claimedData]);

  const refetch = useCallback(() => {
    refetchClaimable();
    refetchClaimed();
  }, [refetchClaimable, refetchClaimed]);

  return {
    claimable: {
      distributions: claimableData || [],
    },
    claimed: {
      distributions: claimedData || [],
    },
    totalRewards,
    isLoading: isClaimableLoading || isClaimedLoading,
    refetch,
  };
};

export default useUserRewards;
