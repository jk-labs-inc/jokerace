import { FC, useState } from "react";
import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import { useShallow } from "zustand/shallow";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { validateCostToVote } from "../../../../../../validation";

interface FlatPricingOptionProps {
  label: string;
  onError?: (value: boolean) => void;
}

const FlatPricingOption: FC<FlatPricingOptionProps> = ({ label, onError }) => {
  const { costToVote, setCharge, minCostToVote } = useDeployContestStore(
    useShallow(state => ({
      costToVote: state.charge.type.costToVote,
      setCharge: state.setCharge,
      minCostToVote: state.minCharge.minCostToVote,
    })),
  );
  const [costToVoteError, setCostToVoteError] = useState("");

  const handleCostToVoteChange = (value: number | null) => {
    const error = validateCostToVote(value, minCostToVote);
    if (error) {
      setCostToVoteError(error);
      onError?.(true);
      setCharge(prev => ({
        ...prev,
        error: true,
      }));
      return;
    } else {
      setCostToVoteError("");
      onError?.(false);
    }

    setCharge(prev => ({
      ...prev,
      type: {
        ...prev.type,
        costToVote: value ?? 0,
      },
      error: false,
    }));
  };

  return (
    <CreateFlowMonetizationInput
      value={costToVote}
      label={label}
      onChange={handleCostToVoteChange}
      errorMessage={costToVoteError}
    />
  );
};

export default FlatPricingOption;
