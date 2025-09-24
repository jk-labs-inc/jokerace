import useContestAbiAndVersion from "@hooks/useContestAbiAndVersion";
import { useEffect } from "react";
import { useEntryContractConfigStore } from "./store";
import { Abi } from "viem";

interface UseEntryContractConfigParams {
  address: string;
  chainId: number;
  proposalId: string;
}

const useEntryContractConfig = ({ address, chainId, proposalId }: UseEntryContractConfigParams) => {
  const { abi, version, isLoading, isError } = useContestAbiAndVersion({
    address: address,
    chainId: chainId,
  });

  const { setContestAddress, setContestChainId, setContestAbi, setContestVersion, setProposalId } =
    useEntryContractConfigStore(state => state);

  useEffect(() => {
    if (isLoading) return;

    if (isError) return;

    setContestAddress(address);
    setContestChainId(chainId);
    setContestAbi(abi as Abi);
    setContestVersion(version);
    setProposalId(proposalId);
  }, [address, chainId, abi, version, isLoading, isError, proposalId]);

  return { isLoading, isError };
};

export default useEntryContractConfig;
