import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { useQuery } from "@tanstack/react-query";
import { PERCENTAGE_TO_CREATOR_DEFAULT } from "constants/monetization";
import { fetchChargeDetails } from "lib/monetization";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const useChargeDetails = (chainName: string) => {
  const { setCharge, setPrevChainRefInCharge, prevChainRefInCharge, priceCurve } = useDeployContestStore(
    useShallow(state => ({
      setCharge: state.setCharge,
      setPrevChainRefInCharge: state.setPrevChainRefInCharge,
      prevChainRefInCharge: state.prevChainRefInCharge,
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
      setCharge({
        percentageToCreator: PERCENTAGE_TO_CREATOR_DEFAULT,
        voteType: VoteType.PerVote,
        type: {
          costToPropose: 0,
          costToVote: chargeDetails.costToVote,
          costToVoteStartPrice: chargeDetails.costToVote,
          costToVoteEndPrice: chargeDetails.costToVote * priceCurve.multipler,
        },
        error: false,
      });
    }

    setPrevChainRefInCharge(chainName);
  }, [chargeDetails, chainName, prevChainRefInCharge, setCharge, setPrevChainRefInCharge]);

  return {
    isLoading,
    isError,
    refetch,
    data: chargeDetails,
  };
};

export default useChargeDetails;
