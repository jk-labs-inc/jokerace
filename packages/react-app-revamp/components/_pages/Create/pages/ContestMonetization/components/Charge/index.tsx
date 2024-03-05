/* eslint-disable react/no-unescaped-entities */
import { chains } from "@config/wagmi";
import useChargeDetails from "@hooks/useChargeDetails";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import ContestParamsChargePercentToCreator from "./components/PercentToCreator";
import ContestParamsChargeSubmission from "./components/Submission";
import ContestParamsChargeVote from "./components/Vote";
import { VoteType } from "@hooks/useDeployContest/types";

interface CreateContestChargeProps {
  isConnected: boolean;
  chain: string;
  onError?: (value: boolean) => void;
  onUnsupportedChain?: (value: boolean) => void;
}

const CreateContestCharge: FC<CreateContestChargeProps> = ({ isConnected, chain, onError, onUnsupportedChain }) => {
  const chainUnitLabel = chains.find(c => c.name === chain)?.nativeCurrency.symbol;
  const { isError, refetch: refetchChargeDetails, isLoading } = useChargeDetails(chain);
  const { charge, minCharge, setCharge } = useDeployContestStore(state => state);
  const { minCostToPropose, minCostToVote } = minCharge;
  const [costToProposeError, setCostToProposeError] = useState("");
  const [costToVoteError, setCostToVoteError] = useState("");

  if (isError) {
    onError?.(true);
    return (
      <p className="text-[20px] text-negative-11 font-bold">
        ruh roh, we couldn't load charge details for this chain!{" "}
        <span className="underline cursor-pointer" onClick={refetchChargeDetails}>
          please try again
        </span>
      </p>
    );
  }

  if (isLoading) {
    return <p className="loadingDots font-sabo text-[20px] text-neutral-9">Loading charge fees</p>;
  }

  if (!isConnected || minCostToPropose === 0 || minCostToVote === 0) {
    onUnsupportedChain?.(true);
    return null;
  }

  const handleCostToProposeChange = (value: number | null) => {
    if (value === null || value < minCostToPropose) {
      setCostToProposeError(`must be at least ${minCostToPropose}`);
      onError?.(true);
      setCharge({
        ...charge,
        error: true,
      });

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
      error: false,
    });
  };

  const handleCostToVoteChange = (value: number | null) => {
    if (value === null || value < minCostToVote) {
      setCostToVoteError(`must be at least ${minCostToVote}`);
      onError?.(true);
      setCharge({
        ...charge,
        error: true,
      });
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
      error: false,
    });
  };

  const handlePercentageToCreatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = event.target.checked ? 0 : 50;

    setCharge({
      ...charge,
      percentageToCreator: newPercentage,
    });
  };

  const handleVoteTypeChange = (value: VoteType) => {
    setCharge({
      ...charge,
      voteType: value,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <ContestParamsChargePercentToCreator
        percentageToCreator={charge.percentageToCreator}
        minCostToPropose={minCostToPropose}
        minCostToVote={minCostToVote}
        onPercentageToCreatorChange={handlePercentageToCreatorChange}
      />
      <div className="flex flex-col gap-8">
        <ContestParamsChargeSubmission
          costToPropose={charge.type.costToPropose}
          chainUnitLabel={chainUnitLabel ?? ""}
          costToProposeError={costToProposeError}
          onCostToProposeChange={handleCostToProposeChange}
        />
        <ContestParamsChargeVote
          costToVote={charge.type.costToVote}
          type={charge.voteType}
          chainUnitLabel={chainUnitLabel ?? ""}
          costToVoteError={costToVoteError}
          onCostToVoteChange={handleCostToVoteChange}
          onVoteTypeChange={handleVoteTypeChange}
        />
      </div>
    </div>
  );
};

export default CreateContestCharge;
