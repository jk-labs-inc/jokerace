import { useQuery } from "@tanstack/react-query";
import { getContestContractVersion } from "@helpers/getContestContractVersion";

interface UseContestAbiAndVersionParams {
  address: string;
  chainId: number;
  enabled?: boolean;
}

export const useContestAbiAndVersion = ({ address, chainId, enabled = true }: UseContestAbiAndVersionParams) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["contestAbiAndVersion", address, chainId],
    queryFn: () => getContestContractVersion(address, chainId),
    enabled: enabled && !!address && !!chainId,
  });

  return {
    abi: data?.abi ?? null,
    version: data?.version ?? "unknown",
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useContestAbiAndVersion;
