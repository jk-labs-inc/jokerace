import { chains } from "@config/wagmi";
import useChargeDetails from "@hooks/useChargeDetails";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/react/shallow";
import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import ContestParamsSplitFeeDestination from "./components/SplitFeeDestination";
import ContestParamsChargeSubmission from "./components/Submission";
import ContestParamsChargeVote from "./components/Vote";
import { validateSplitFeeDestination, validateSplitFeeDestinationAddress } from "./validation";

interface CreateContestChargeProps {
  chain: string;
  onError?: (value: boolean) => void;
}

const CreateContestCharge: FC<CreateContestChargeProps> = ({ chain, onError }) => {
  const chainUnitLabel = chains.find(c => c.name.toLowerCase() === chain.toLowerCase())?.nativeCurrency.symbol;
  const { isError, refetch: refetchChargeDetails, isLoading } = useChargeDetails(chain);
  const { splitFeeDestination, setCharge } = useDeployContestStore(
    useShallow(state => ({
      splitFeeDestination: state.charge.splitFeeDestination,
      setCharge: state.setCharge,
    })),
  );
  const [splitFeeDestinationError, setSplitFeeDestinationError] = useState("");

  if (isError) {
    onError?.(true);
    return (
      <p className="text-[20px] text-negative-11 font-bold">
        ruh roh, we couldn't load charge details for this chain!{" "}
        <button className="underline cursor-pointer" onClick={() => refetchChargeDetails()}>
          please try again
        </button>
      </p>
    );
  }

  if (isLoading) {
    return <p className="loadingDots font-sabo-filled text-[20px] text-neutral-9">Loading charge fees</p>;
  }

  const handleSplitFeeDestinationTypeChange = (type: SplitFeeDestinationType) => {
    const newSplitFeeDestination = { ...splitFeeDestination, type };
    const validationError = validateSplitFeeDestination(newSplitFeeDestination);

    setSplitFeeDestinationError(validationError ?? "");
    onError?.(!!validationError);

    setCharge(prev => ({
      ...prev,
      splitFeeDestination: newSplitFeeDestination,
      error: !!validationError,
    }));
  };

  const handleSplitFeeDestinationAddressChange = (address: string) => {
    const newSplitFeeDestination = { ...splitFeeDestination, address };
    const validationError = validateSplitFeeDestinationAddress(newSplitFeeDestination);

    setSplitFeeDestinationError(validationError ?? "");
    onError?.(!!validationError);

    setCharge(prev => ({
      ...prev,
      splitFeeDestination: newSplitFeeDestination,
      error: !!validationError,
    }));
  };

  return (
    <div className="flex flex-col gap-12">
      <ContestParamsSplitFeeDestination
        splitFeeDestination={splitFeeDestination}
        splitFeeDestinationError={splitFeeDestinationError}
        onSplitFeeDestinationTypeChange={handleSplitFeeDestinationTypeChange}
        onSplitFeeDestinationAddressChange={handleSplitFeeDestinationAddressChange}
        includeRewardsInfo
      />
      <div className="flex flex-col gap-8">
        <ContestParamsChargeSubmission chainUnitLabel={chainUnitLabel ?? ""} onError={onError} />
        <ContestParamsChargeVote chainUnitLabel={chainUnitLabel ?? ""} onError={onError} />
      </div>
    </div>
  );
};

export default CreateContestCharge;
