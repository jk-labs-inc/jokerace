import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface UseRewardsModuleAddressProps {
  contestAddress: `0x${string}`;
  contestChainId: number;
  contestAbi: Abi;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const useRewardsModuleAddress = ({ contestAddress, contestChainId, contestAbi }: UseRewardsModuleAddressProps) => {
  const { data, isLoading, isError, isSuccess } = useReadContract({
    address: contestAddress,
    chainId: contestChainId,
    abi: contestAbi,
    functionName: "officialRewardsModule",
    query: {
      staleTime: Infinity,
      select: data => {
        if (data === ZERO_ADDRESS) return "";

        return data as `0x${string}`;
      },
    },
  });

  return {
    data,
    isLoading,
    isSuccess,
    isError,
  };
};

export default useRewardsModuleAddress;
