import { fetchChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";

const useChargeDetails = (chainName: string) => {
  const [minCostToPropose, setMinCostToPropose] = useState<number>(0);
  const [minCostToVote, setMinCostToVote] = useState<number>(0);

  const fetchDetails = useCallback(async () => {
    const { minCostToPropose, minCostToVote } = await fetchChargeDetails(chainName);
    setMinCostToPropose(minCostToPropose);
    setMinCostToVote(minCostToVote);
  }, [chainName]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { minCostToPropose, minCostToVote };
};

export default useChargeDetails;
