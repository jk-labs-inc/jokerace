import { chains } from "@config/wagmi";
import useChargeDetails from "@hooks/useChargeDetails";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useEffect, useState } from "react";
import ContestParamsChargePercentToCreator from "./PercentToCreator";
import ContestParamsChargeSubmission from "./Submission";
import ContestParamsChargeVote from "./Vote";

interface ContestParamsChargeProps {
  isConnected: boolean;
  chain: string;
  onError?: (value: boolean) => void;
}

const ContestParamsCharge: FC<ContestParamsChargeProps> = ({ isConnected, chain, onError }) => {
  const chainUnitLabel = chains.find(c => c.name === chain)?.nativeCurrency.symbol;
  const { minCostToPropose, minCostToVote } = useChargeDetails(chain);
  const { charge, setCharge } = useDeployContestStore(state => state);
  const [costToProposeError, setCostToProposeError] = useState("");
  const [costToVoteError, setCostToVoteError] = useState("");

  useEffect(() => {
    const isCostToProposeSet = charge.charges.costToPropose !== 0;
    const isCostToVoteSet = charge.charges.costToVote !== 0;

    if (minCostToPropose === 0 || minCostToVote === 0 || isCostToProposeSet || isCostToVoteSet) {
      return;
    }

    setCharge({
      ...charge,
      charges: {
        ...charge.charges,
        costToPropose: minCostToPropose,
        costToVote: minCostToVote,
      },
    });
  }, [charge, minCostToPropose, minCostToVote, setCharge]);

  if (!isConnected || minCostToPropose === 0 || minCostToVote === 0) return null;

  const handleCostToProposeChange = (value: number | null) => {
    if (value === null || value < minCostToPropose) {
      setCostToProposeError(`must be at least ${minCostToPropose}`);
      onError?.(true);

      return;
    } else {
      setCostToProposeError("");
      onError?.(false);
    }

    setCharge({
      ...charge,
      charges: {
        ...charge.charges,
        costToPropose: value,
      },
    });
  };

  const handleCostToVoteChange = (value: number | null) => {
    if (value === null || value < minCostToVote) {
      setCostToVoteError(`must be at least ${minCostToVote}`);
      onError?.(true);
      return;
    } else {
      setCostToVoteError("");
      onError?.(false);
    }

    setCharge({
      ...charge,
      charges: {
        ...charge.charges,
        costToVote: value,
      },
    });
  };

  const handlePercentageToCreatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = event.target.checked ? 0 : 50;

    setCharge({
      ...charge,
      percentageToCreator: newPercentage,
    });
  };

  return (
    <>
      <ContestParamsChargeSubmission
        costToPropose={charge.charges.costToPropose}
        chainUnitLabel={chainUnitLabel ?? ""}
        costToProposeError={costToProposeError}
        onCostToProposeChange={handleCostToProposeChange}
      />
      <ContestParamsChargeVote
        costToVote={charge.charges.costToVote}
        chainUnitLabel={chainUnitLabel ?? ""}
        costToVoteError={costToVoteError}
        onCostToVoteChange={handleCostToVoteChange}
      />

      <ContestParamsChargePercentToCreator
        percentageToCreator={charge.percentageToCreator}
        minCostToPropose={minCostToPropose}
        minCostToVote={minCostToVote}
        onPercentageToCreatorChange={handlePercentageToCreatorChange}
      />
    </>
  );
};

export default ContestParamsCharge;
