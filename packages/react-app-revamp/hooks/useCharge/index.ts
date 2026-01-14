import { createResultGetter } from "@hooks/useContest/helpers";
import { CREATOR_SPLIT_VERSION } from "@hooks/useContest/v3v4/contracts";
import { type Charge } from "@hooks/useDeployContest/types";
import { compareVersions } from "compare-versions";
import { Abi } from "viem";
import { useReadContracts } from "wagmi";

interface UseChargeParams {
  address: `0x${string}`;
  abi: Abi;
  chainId: number;
  version: string;
}

interface UseChargeResult {
  charge: Charge;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const getContracts = (address: `0x${string}`, abi: Abi, chainId: number, percentageFunctionName: string) => {
  return [
    {
      address,
      abi,
      chainId,
      functionName: percentageFunctionName,
      args: [],
    },
    {
      address,
      abi,
      chainId,
      functionName: "costToVote",
      args: [],
    },
    {
      address,
      abi,
      chainId,
      functionName: "payPerVote",
      args: [],
    },
    {
      address,
      abi,
      chainId,
      functionName: "creatorSplitDestination",
      args: [],
    },
  ];
};

const getDefaultCharge = (): Charge => ({
  percentageToRewards: 0,
  costToVote: 0,
  error: false,
});

/**
 * Pure hook that fetches charge-related contract data and returns it formatted as Charge type
 * Note: creatorSplitEnabled is fetched separately via useCreatorSplitEnabled hook when needed
 **/
export const useCharge = ({ address, abi, chainId, version }: UseChargeParams): UseChargeResult => {
  const hasCreatorSplit = compareVersions(version, CREATOR_SPLIT_VERSION) >= 0;
  const percentageFunctionName = hasCreatorSplit ? "percentageToRewards" : "percentageToCreator";
  const contracts = getContracts(address, abi, chainId, percentageFunctionName);

  const {
    data: charge,
    isLoading,
    isError,
    refetch,
  } = useReadContracts({
    contracts: contracts as any,
    query: {
      select: data => {
        if (!data) return getDefaultCharge();

        const getResultByName = createResultGetter(contracts, [...data]);

        const percentageToRewards = Number(getResultByName(percentageFunctionName)) || 0;
        const costToVote = Number(getResultByName("costToVote")) || 0;

        return {
          percentageToRewards,
          costToVote,
          error: false,
        } as Charge;
      },
    },
  });

  return {
    charge: charge || getDefaultCharge(),
    isLoading,
    isError,
    refetch,
  };
};

export default useCharge;
