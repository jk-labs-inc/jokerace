import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { SplitFeeDestinationType, VoteType } from "@hooks/useDeployContest/types";
import { PERCENTAGE_TO_CREATOR_DEFAULT } from "constants/monetization";
import { fetchChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";

const useChargeDetails = (chainName: string) => {
  const { setCharge, setPrevChainRefInCharge, prevChainRefInCharge, setMinCharge } = useDeployContestStore();
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
        percentageToCreator: PERCENTAGE_TO_CREATOR_DEFAULT,
        splitFeeDestination: { type: SplitFeeDestinationType.CreatorWallet, address: "" },
        voteType: VoteType.PerVote,
        type: {
          costToPropose: 0,
          costToVote: 0,
          costToVoteEndPrice: 0,
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
        minCostToVoteEndPrice: details.minCostToVote * 10,
      });

      setCharge({
        percentageToCreator: PERCENTAGE_TO_CREATOR_DEFAULT,
        splitFeeDestination: { type: SplitFeeDestinationType.CreatorWallet, address: "" },
        voteType: VoteType.PerVote,
        type: {
          costToPropose: details.defaultCostToPropose,
          costToVote: details.defaultCostToVote,
          costToVoteEndPrice: details.defaultCostToVote * 1000,
        },
        error: false,
      });

      setPrevChainRefInCharge(chainName);
    }
  }, [chainName, prevChainRefInCharge, setCharge, setMinCharge, setPrevChainRefInCharge]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { isLoading, isError, refetch: fetchDetails };
};

export default useChargeDetails;
