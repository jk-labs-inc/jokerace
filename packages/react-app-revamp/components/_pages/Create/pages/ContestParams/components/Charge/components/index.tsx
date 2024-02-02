/* eslint-disable react/no-unescaped-entities */
import { chains } from "@config/wagmi";
import useChargeDetails from "@hooks/useChargeDetails";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
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
  const { minCostToPropose, minCostToVote, isError, refetch: refetchChargeDetails } = useChargeDetails(chain);
  const { charge, setCharge } = useDeployContestStore(state => state);
  const [costToProposeError, setCostToProposeError] = useState("");
  const [costToVoteError, setCostToVoteError] = useState("");

  if (isError) {
    onError?.(true);
    return (
      <p className="text-[24px] text-negative-11 font-bold">
        ruh roh, we couldn't load charge details for this chain!{" "}
        <span className="underline cursor-pointer" onClick={refetchChargeDetails}>
          please try again
        </span>
      </p>
    );
  }

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
      type: {
        ...charge.type,
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
      type: {
        ...charge.type,
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
        costToPropose={charge.type.costToPropose}
        chainUnitLabel={chainUnitLabel ?? ""}
        costToProposeError={costToProposeError}
        onCostToProposeChange={handleCostToProposeChange}
      />
      <ContestParamsChargeVote
        costToVote={charge.type.costToVote}
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
