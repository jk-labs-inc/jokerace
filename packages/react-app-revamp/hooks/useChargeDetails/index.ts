import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { fetchChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";

const useChargeDetails = (chainName: string) => {
  const { setCharge, setPrevChainRefInCharge, prevChainRefInCharge, setMinCharge, votingMerkle } =
    useDeployContestStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const isAnyoneCanVote = Object.values(votingMerkle).every(value => value === null);

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
        voteType: isAnyoneCanVote ? VoteType.PerVote : VoteType.PerTransaction,
        type: {
          costToPropose: 0,
          costToVote: 0,
        },
        error: true,
      });
      setPrevChainRefInCharge(chainName);
    }

    if (!details.isError) {
      if (prevChainRefInCharge === chainName) {
        setIsLoading(false);
        setIsError(false);
        return;
      }
      setMinCharge({
        minCostToPropose: details.minCostToPropose,
        minCostToVote: details.minCostToVote,
      });

      setCharge({
        percentageToCreator: 50,
        voteType: isAnyoneCanVote ? VoteType.PerVote : VoteType.PerTransaction,
        type: {
          costToPropose: details.minCostToPropose,
          costToVote: details.minCostToVote,
        },
        error: false,
      });

      setPrevChainRefInCharge(chainName);
    }
  }, [chainName, isAnyoneCanVote, prevChainRefInCharge, setCharge, setMinCharge, setPrevChainRefInCharge]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { isLoading, isError, refetch: fetchDetails };
};

export default useChargeDetails;
