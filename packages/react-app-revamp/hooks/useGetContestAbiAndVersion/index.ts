import getContestContractVersion from "@helpers/getContestContractVersion";
import { useState, useEffect } from "react";

type ContestContractData = {
  abi: any;
  version: string;
  isLoading: boolean;
  error: Error | null;
};

/**
 * hook to fetch contest contract ABI and version
 * @param address - the contract address
 * @param chainId - the chain ID where the contract is deployed
 * @returns object containing abi, version, loading state and error
 */
const useContestAbiAndVersion = (address: string | undefined, chainId: number | undefined): ContestContractData => {
  const [abi, setAbi] = useState<any>(null);
  const [version, setVersion] = useState<string>("unknown");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setAbi(null);
    setVersion("unknown");
    setError(null);

    if (!address || !chainId) {
      return;
    }

    const fetchContractData = async () => {
      try {
        setIsLoading(true);
        const { abi: contractAbi, version: contractVersion } = await getContestContractVersion(address, chainId);
        setAbi(contractAbi);
        setVersion(contractVersion);
      } catch (err) {
        console.error("Error fetching contest contract data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractData();
  }, [address, chainId]);

  return { abi, version, isLoading, error };
};

export default useContestAbiAndVersion;
