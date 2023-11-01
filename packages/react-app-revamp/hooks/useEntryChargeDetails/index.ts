import { fetchEntryChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";

const useEntryChargeDetails = (chainName: string) => {
  const [minCostToPropose, setMinCostToPropose] = useState<number>(0);

  const fetchDetails = useCallback(async () => {
    const minCostToPropose = await fetchEntryChargeDetails(chainName);
    setMinCostToPropose(minCostToPropose);
  }, [chainName]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return minCostToPropose;
};

export default useEntryChargeDetails;
