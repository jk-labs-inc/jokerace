import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import CreateRadioButtonsGroup from "@components/_pages/Create/components/RadioButtonsGroup";
import { RadioButtonsGroupType, RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup/types";
import { ContestType } from "@components/_pages/Create/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/shallow";
import { validateCostToVote } from "../../validation";
import CreateContestChargeVoteCurves from "./components/Curves";

interface ContestParamsChargeVoteProps {
  chainUnitLabel: string;
  onError?: (value: boolean) => void;
}

const ContestParamsChargeVote: FC<ContestParamsChargeVoteProps> = ({ chainUnitLabel, onError }) => {
  const { costToVote, voteType, minCostToVote, setCharge, contestType } = useDeployContestStore(
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
          type={RadioButtonsGroupType.NORMAL}
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
