import getContestContractVersion from "@helpers/getContestContractVersion";
import { useQuery } from "@tanstack/react-query";

const useContractVersion = (address: string, chainId: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contractVersion", address, chainId],
    queryFn: () => getContestContractVersion(address as `0x${string}`, chainId),
    enabled: !!address && !!chainId,
  });

  return {
    version: data?.version ?? "",
    isLoading,
    isError,
  };
};

export default useContractVersion;
