import { ProposalData, fetchProposalData } from "lib/proposal";
import { useCallback, useEffect, useState } from "react";

const useFetchProposalData = (abi: any, version: string, address: string, chainId: number, submission: string) => {
  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const result = await fetchProposalData(abi, version, address, chainId, submission);
      setData(result);
    } catch (err: any) {
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [abi, version, address, chainId, submission]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};

export default useFetchProposalData;
