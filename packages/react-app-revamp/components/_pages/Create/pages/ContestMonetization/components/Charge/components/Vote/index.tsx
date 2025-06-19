import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";
import CreateRadioButtonsGroup, { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";
import { VoteType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import CreateContestChargeVoteCurves from "./components/Curves";

interface ContestParamsChargeVoteProps {
  costToVote: number;
  type: VoteType;
  chainUnitLabel: string;
  costToVoteError: string;
  isAnyoneCanVote: boolean;
  costToVoteEndPrice?: number;
  onCostToVoteEndPriceChange?: (value: number) => void;
  onCostToVoteChange?: (value: number | null) => void;
  onVoteTypeChange?: (value: VoteType) => void;
}

const ContestParamsChargeVote: FC<ContestParamsChargeVoteProps> = ({
  costToVote,
  type,
  chainUnitLabel,
  costToVoteError,
  isAnyoneCanVote,
  costToVoteEndPrice,
  onCostToVoteEndPriceChange,
  onCostToVoteChange,
  onVoteTypeChange,
}) => {
  const [selected, setSelected] = useState<VoteType>(type);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    if (isAnyoneCanVote) {
      setSelected(VoteType.PerVote);
      onVoteTypeChange?.(VoteType.PerVote);
    } else {
      setSelected(VoteType.PerTransaction);
      onVoteTypeChange?.(VoteType.PerTransaction);
    }
  }, [isAnyoneCanVote]);

  const handleVoteTypeChange = (value: VoteType) => {
    setSelected(value);
    onVoteTypeChange?.(value);
  };

  const getOptions = (): RadioOption[] => {
    return [
      {
        label: "a charge each time they vote (recommended)",
        value: VoteType.PerTransaction,
        content:
          selected === VoteType.PerTransaction ? (
            <CreateFlowMonetizationInput
              value={costToVote}
              onChange={onCostToVoteChange}
              errorMessage={costToVoteError}
              label={chainUnitLabel}
            />
          ) : null,
      },
      {
        label: "a charge per vote",
        value: VoteType.PerVote,
        content:
          selected === VoteType.PerVote ? (
            <CreateFlowMonetizationInput
              value={costToVote}
              onChange={onCostToVoteChange}
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
        <CreateContestChargeVoteCurves
          costToVote={costToVote}
          label={chainUnitLabel}
          errorMessage={costToVoteError}
          costToVoteEndPrice={costToVoteEndPrice}
          onCostToVoteEndPriceChange={onCostToVoteEndPriceChange}
          onCostToVoteChange={onCostToVoteChange}
        />
      ) : (
        <CreateRadioButtonsGroup options={getOptions()} value={selected} onChange={handleVoteTypeChange} />
      )}
    </div>
  );
};

export default ContestParamsChargeVote;
