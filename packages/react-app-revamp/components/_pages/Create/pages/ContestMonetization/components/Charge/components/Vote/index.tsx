import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";
import { VoteType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import CreateContestChargeVoteCurves from "./components/Curves";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { ContestType } from "@components/_pages/Create/types";
import { useShallow } from "zustand/react/shallow";
import { validateCostToVote, validateStartAndEndPrice } from "../../validation";

interface ContestParamsChargeVoteProps {
  chainUnitLabel: string;
  onError?: (value: boolean) => void;
}

const ContestParamsChargeVote: FC<ContestParamsChargeVoteProps> = ({ chainUnitLabel, onError }) => {
  const { costToVote, costToVoteEndPrice, voteType, minCostToVote, setCharge, contestType } = useDeployContestStore(
    useShallow(state => ({
      costToVote: state.charge.type.costToVote,
      costToVoteEndPrice: state.charge.type.costToVoteEndPrice,
      voteType: state.charge.voteType,
      minCostToVote: state.minCharge.minCostToVote,
      setCharge: state.setCharge,
      contestType: state.contestType,
    })),
  );
  const [costToVoteError, setCostToVoteError] = useState("");
  const isAnyoneCanVote = contestType === ContestType.AnyoneCanPlay || contestType === ContestType.VotingContest;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    if (isAnyoneCanVote) {
      setCharge(prev => ({
        ...prev,
        voteType: VoteType.PerVote,
      }));
    } else {
      setCharge(prev => ({
        ...prev,
        voteType: VoteType.PerTransaction,
      }));
    }
  }, [isAnyoneCanVote, setCharge]);

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

  const handleVoteTypeChange = (value: VoteType) => {
    setCharge(prev => ({
      ...prev,
      voteType: value,
    }));
  };

  const handleCostToVoteEndPriceChange = (value: number) => {
    const error = validateStartAndEndPrice(costToVote, value);

    if (error) {
      //TODO: we should show only cost to vote end price error
      onError?.(true);
      return;
    }

    setCharge(prev => ({
      ...prev,
      type: {
        ...prev.type,
        costToVoteEndPrice: value,
      },
    }));
  };

  const getOptions = (): RadioOption[] => {
    return [
      {
        label: "a charge each time they vote (recommended)",
        value: VoteType.PerTransaction,
        content:
          voteType === VoteType.PerTransaction ? (
            <CreateFlowMonetizationInput
              value={costToVote}
              onChange={handleCostToVoteChange}
              errorMessage={costToVoteError}
              label={chainUnitLabel}
            />
          ) : null,
      },
      {
        label: "a charge per vote",
        value: VoteType.PerVote,
        content:
          voteType === VoteType.PerVote ? (
            <CreateFlowMonetizationInput
              value={costToVote}
              onChange={handleCostToVoteChange}
              errorMessage={costToVoteError}
              label={chainUnitLabel}
            />
          ) : null,
      },
    ];
  };

  return (
    // TODO: check spacing here
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        {isAnyoneCanVote ? (
          <>
            what is the charge players <b>pay per vote</b>?
          </>
        ) : isMobile ? (
          <>
            what is the charge to <b>vote</b>?
          </>
        ) : (
          <>
            what is the charge for players to <b>vote</b> in the contest?
          </>
        )}
      </p>
      {isAnyoneCanVote ? (
        <CreateContestChargeVoteCurves label={chainUnitLabel} onError={onError} />
      ) : (
        <CreateRadioButtonsGroup
          options={getOptions()}
          value={voteType}
          onChange={handleVoteTypeChange}
          gapClassName="gap-8"
        />
      )}
    </div>
  );
};

export default ContestParamsChargeVote;
