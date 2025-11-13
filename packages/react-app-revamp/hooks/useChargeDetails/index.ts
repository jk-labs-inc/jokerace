import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { useQuery } from "@tanstack/react-query";
import { PERCENTAGE_TO_CREATOR_DEFAULT } from "constants/monetization";
import { fetchChargeDetails } from "lib/monetization";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const useChargeDetails = (chainName: string) => {
  const { setCharge, setPrevChainRefInCharge, prevChainRefInCharge, setMinCharge, priceCurve } = useDeployContestStore(
    useShallow(state => ({
      setCharge: state.setCharge,
      setPrevChainRefInCharge: state.setPrevChainRefInCharge,
      prevChainRefInCharge: state.prevChainRefInCharge,
      setMinCharge: state.setMinCharge,
      priceCurve: state.priceCurve,
    })),
  );
  const {
    data: chargeDetails,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["chargeDetails", chainName],
    queryFn: () => fetchChargeDetails(chainName),
    enabled: !!chainName,
  });

  useEffect(() => {
    if (!chargeDetails || !chainName) return;

    if (prevChainRefInCharge === chainName) return;

    if (chargeDetails.isError) {
      setCharge({
        percentageToCreator: PERCENTAGE_TO_CREATOR_DEFAULT,
        voteType: VoteType.PerVote,
        type: {
          costToPropose: 0,
          costToVote: 0,
          costToVoteStartPrice: 0,
          costToVoteEndPrice: 0,
        },
        error: true,
      });
    } else {
      setMinCharge({
        minCostToPropose: chargeDetails.minCostToPropose,
        minCostToVote: chargeDetails.minCostToVote,
      });

      setCharge({
        percentageToCreator: PERCENTAGE_TO_CREATOR_DEFAULT,
        voteType: VoteType.PerVote,
        type: {
          costToPropose: chargeDetails.defaultCostToPropose,
          costToVote: chargeDetails.defaultCostToVote,
          costToVoteStartPrice: chargeDetails.defaultCostToVoteStartPrice,
          costToVoteEndPrice: chargeDetails.defaultCostToVoteStartPrice * priceCurve.multipler,
        },
        error: false,
      });
    }

    setPrevChainRefInCharge(chainName);
  }, [chargeDetails, chainName, prevChainRefInCharge, setCharge, setMinCharge, setPrevChainRefInCharge]);

  return {
    isLoading,
    isError,
    refetch,
    data: chargeDetails,
  };
};

export default useChargeDetails;
