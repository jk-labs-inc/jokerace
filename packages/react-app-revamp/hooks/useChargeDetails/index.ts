import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { fetchChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";

const useChargeDetails = (chainName: string) => {
  const { setCharge } = useDeployContestStore();
  const [minCostToPropose, setMinCostToPropose] = useState<number>(0);
  const [minCostToVote, setMinCostToVote] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchDetails = useCallback(async () => {
    if (!chainName) {
      setIsLoading(false);
      setIsError(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const details = await fetchChargeDetails(chainName);

    setIsLoading(false);
    setIsError(details.isError);

    if (!details.isError) {
      setMinCostToPropose(details.minCostToPropose);
      setMinCostToVote(details.minCostToVote);

      setCharge({
        percentageToCreator: 50,
        type: {
          costToPropose: details.minCostToPropose,
          costToVote: details.minCostToVote,
        },
      });
    }
  }, [chainName, setCharge]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { minCostToPropose, minCostToVote, isLoading, isError, refetch: fetchDetails };
};

export default useChargeDetails;
