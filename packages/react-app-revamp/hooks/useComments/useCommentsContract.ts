import { chains, config } from "@config/wagmi";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useError } from "@hooks/useError";
import { Abi } from "viem";
import { useShallow } from "zustand/shallow";

interface ContractConfig {
  address: `0x${string}`;
  abi: Abi;
  chainId: number;
}

/**
 * Hook for managing contest contract configuration
 * @param address - Contest contract address
 * @param chainId - Chain ID for the contest
 */
export const useCommentsContract = (address: string, chainId: number) => {
  const { abi } = useContestConfigStore(
    useShallow(state => ({
      abi: state.contestConfig.abi,
    })),
  );
  const { handleError } = useError();
  const chainName = chains.filter((chain: { id: number }) => chain.id === chainId)?.[0]?.name.toLowerCase() ?? "";

  const getContractConfig = (): ContractConfig | null => {
    try {
      if (!abi) {
        const errorMessage = `RPC call failed - ABI not available`;
        handleError(errorMessage, "Error fetching contract config");
        return null;
      }

      return {
        address: address as `0x${string}`,
        abi: abi as Abi,
        chainId: chainId,
      };
    } catch (error: any) {
      handleError(error.message, "Error fetching contract config");
      return null;
    }
  };

  return {
    getContractConfig,
    chainName,
    config,
  };
};
