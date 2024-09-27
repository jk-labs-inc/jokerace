/* eslint-disable react/no-unescaped-entities */
import { chains } from "@config/wagmi";
import { addressRegex } from "@helpers/regex";
import useChargeDetails from "@hooks/useChargeDetails";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { SplitFeeDestinationType, VoteType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import ContestParamsSplitFeeDestination from "./components/SplitFeeDestination";
import ContestParamsChargeSubmission from "./components/Submission";
import ContestParamsChargeVote from "./components/Vote";

interface CreateContestChargeProps {
  isConnected: boolean;
  chain: string;
  onError?: (value: boolean) => void;
  onUnsupportedChain?: (value: boolean) => void;
}

const CreateContestCharge: FC<CreateContestChargeProps> = ({ isConnected, chain, onError, onUnsupportedChain }) => {
  const chainUnitLabel = chains.find(c => c.name.toLowerCase() === chain.toLowerCase())?.nativeCurrency.symbol;
  const { isError, refetch: refetchChargeDetails, isLoading } = useChargeDetails(chain);
  const { charge, minCharge, setCharge, votingMerkle } = useDeployContestStore(state => state);
  const { minCostToPropose, minCostToVote } = minCharge;
  const [costToProposeError, setCostToProposeError] = useState("");
  const [costToVoteError, setCostToVoteError] = useState("");
  const [splitFeeDestinationError, setSplitFeeDestinationError] = useState("");
  const isAnyoneCanVote = Object.values(votingMerkle).every(value => value === null);

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

  const handleSplitFeeDestinationTypeChange = (type: SplitFeeDestinationType) => {
    const isCreatorWalletOrNoSplit =
      type === SplitFeeDestinationType.CreatorWallet || type === SplitFeeDestinationType.NoSplit;
    const newPercentageToCreator = type === SplitFeeDestinationType.NoSplit ? 0 : 50;
    const newSplitFeeDestination = { ...charge.splitFeeDestination, type };

    const isValidAddress = addressRegex.test(charge.splitFeeDestination.address ?? "");
    const error = !isCreatorWalletOrNoSplit && !isValidAddress;

    setSplitFeeDestinationError(isCreatorWalletOrNoSplit ? "" : error ? "invalid address" : "");
    onError?.(error);

    setCharge({
      ...charge,
      percentageToCreator: newPercentageToCreator,
      splitFeeDestination: newSplitFeeDestination,
      error,
    });
  };

  const handleSplitFeeDestinationAddressChange = (address: string) => {
    const isValidAddress = addressRegex.test(address);
    const newSplitFeeDestination = { ...charge.splitFeeDestination, address };

    setSplitFeeDestinationError(isValidAddress ? "" : "invalid address");
    onError?.(!isValidAddress);

    setCharge({
      ...charge,
      splitFeeDestination: newSplitFeeDestination,
      error: !isValidAddress,
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
      <ContestParamsSplitFeeDestination
        splitFeeDestination={charge.splitFeeDestination}
        splitFeeDestinationError={splitFeeDestinationError}
        onSplitFeeDestinationTypeChange={handleSplitFeeDestinationTypeChange}
        onSplitFeeDestinationAddressChange={handleSplitFeeDestinationAddressChange}
        includeRewardsInfo
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
          isAnyoneCanVote={isAnyoneCanVote}
        />
      </div>
    </div>
  );
};

export default CreateContestCharge;
