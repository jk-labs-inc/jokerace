import { getChainId } from "@helpers/getChainId";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import useContestAbiAndVersion from "@hooks/useContestAbiAndVersion";
import { useEffect } from "react";
import { Abi } from "viem";
import useContestConfigStore from "./store";

interface UseContestConfigParams {
  address: `0x${string}`;
  chainName: string;
  proposalId?: string;
}

const useContestConfig = ({ address, chainName, proposalId }: UseContestConfigParams) => {
  const { contestConfig, setContestConfig, setProposalId } = useContestConfigStore(state => state);
  const chainId = getChainId(chainName);
  const { abi, version, isLoading, isError } = useContestAbiAndVersion({ address, chainId });

  useEffect(() => {
    if (isLoading || isError) return;

    setContestConfig({
      address,
      chainName,
      chainId,
      chainNativeCurrencySymbol: getNativeTokenSymbol(chainName) ?? "",
      abi: abi as Abi,
      version,
    });

    if (proposalId) {
      setProposalId(proposalId);
    }
  }, [address, abi, chainId, version, proposalId, isLoading, isError, chainName]);

  return { contestConfig, isLoading, isError };
};

export default useContestConfig;
