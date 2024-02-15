import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { fetchChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";

const useChargeDetails = (chainName: string) => {
  const { setCharge, charge } = useDeployContestStore();
  const [minCostToPropose, setMinCostToPropose] = useState<number>(0);
  const [minCostToVote, setMinCostToVote] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    if (!chainName) {
      setIsLoading(false);
      setIsError(false);
      return;
    }

    const details = await fetchChargeDetails(chainName);

    setIsLoading(false);
    setIsError(details.isError);

    if (details.isError) {
      setCharge({
        percentageToCreator: 50,
        type: {
          costToPropose: details.minCostToPropose,
          costToVote: details.minCostToVote,
        },
        error: true,
      });
    }

    if (!details.isError) {
      setMinCostToPropose(details.minCostToPropose);
      setMinCostToVote(details.minCostToVote);

      setCharge({
        percentageToCreator: 50,
        type: {
          costToPropose: details.minCostToPropose,
          costToVote: details.minCostToVote,
        },
        error: false,
      });
    }
  }, [chainName, setCharge]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { minCostToPropose, minCostToVote, isLoading, isError, refetch: fetchDetails };
};

export default useChargeDetails;
