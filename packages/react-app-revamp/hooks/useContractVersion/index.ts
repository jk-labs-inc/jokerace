import getContestContractVersion from "@helpers/getContestContractVersion";
import { useEffect, useState } from "react";

const useContractVersion = (address: string, chainId: number) => {
  const [version, setVersion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchContractVersion = async () => {
      try {
        setIsLoading(true);

        const { version } = await getContestContractVersion(address as `0x${string}`, chainId);
        setVersion(version);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching contract version:", error);

        setVersion("");
        setIsLoading(false);
        setError(true);
      }
    };

    if (address && chainId) {
      fetchContractVersion();
    }
  }, [address, chainId]);

  return { version, isLoading, error };
};

export default useContractVersion;
