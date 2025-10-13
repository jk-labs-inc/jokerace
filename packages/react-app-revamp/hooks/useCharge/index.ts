import { createResultGetter, determineSplitFeeDestination } from "@hooks/useContest/helpers";
import { SplitFeeDestinationType, VoteType, type Charge } from "@hooks/useDeployContest/types";
import { Abi } from "viem";
import { useReadContracts } from "wagmi";

interface UseChargeParams {
  address: `0x${string}`;
  abi: Abi;
  chainId: number;
  creatorAddress?: string;
  rewardsModuleAddress?: string;
}

interface UseChargeResult {
  charge: Charge;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const getContracts = (address: `0x${string}`, abi: Abi, chainId: number) => {
  return [
    {
      address,
      abi,
      chainId,
      functionName: "percentageToCreator",
      args: [],
    },
    {
      address,
      abi,
      chainId,
      functionName: "costToPropose",
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
  percentageToCreator: 0,
  voteType: VoteType.PerVote,
  splitFeeDestination: {
    type: SplitFeeDestinationType.NoSplit,
    address: "",
  },
  type: {
    costToPropose: 0,
    costToVote: 0,
  },
  error: false,
});

/**
 * Pure hook that fetches charge-related contract data and returns it formatted as Charge type
 **/
export const useCharge = ({
  address,
  abi,
  chainId,
  creatorAddress,
  rewardsModuleAddress,
}: UseChargeParams): UseChargeResult => {
  const contracts = getContracts(address, abi, chainId);

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

        const percentageToCreator = Number(getResultByName("percentageToCreator")) || 0;
        const costToPropose = Number(getResultByName("costToPropose")) || 0;
        const costToVote = Number(getResultByName("costToVote")) || 0;
        const payPerVote = Number(getResultByName("payPerVote")) || 1;
        const creatorSplitDestination = (getResultByName("creatorSplitDestination") as string) || "";

        return {
          percentageToCreator,
          voteType: payPerVote > 0 ? VoteType.PerVote : VoteType.PerTransaction,
          splitFeeDestination: {
            type: determineSplitFeeDestination(
              creatorSplitDestination,
              percentageToCreator,
              creatorAddress ?? "",
              rewardsModuleAddress,
            ),
            address: creatorSplitDestination,
          },
          type: {
            costToPropose,
            costToVote,
          },
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
