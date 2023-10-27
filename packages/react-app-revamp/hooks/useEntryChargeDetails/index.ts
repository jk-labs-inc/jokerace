import { fetchEntryChargeDetails, fetchAllNetworkNames } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";

const useEntryChargeDetails = (chainName: string) => {
  const [minCostToPropose, setMinCostToPropose] = useState<number>(0);
  const [networkNames, setNetworkNames] = useState<string[]>([]);

  const fetchDetails = useCallback(async () => {
    const minCostToPropose = await fetchEntryChargeDetails(chainName);
    setMinCostToPropose(minCostToPropose);
  }, [chainName]);

  const fetchNetworkNames = useCallback(async () => {
    const networkNames = await fetchAllNetworkNames();
    setNetworkNames(networkNames);
  }, []);

  useEffect(() => {
    fetchDetails();
    fetchNetworkNames();
  }, [fetchDetails, fetchNetworkNames]);

  return { minCostToPropose, networkNames };
};

export default useEntryChargeDetails;
