import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { RadioGroup } from "@headlessui/react";
import { VoteType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";

interface ContestParamsChargeVoteProps {
  costToVote: number;
  type: VoteType;
  chainUnitLabel: string;
  costToVoteError: string;
  onCostToVoteChange?: (value: number | null) => void;
  onVoteTypeChange?: (value: VoteType) => void;
}

const ContestParamsChargeVote: FC<ContestParamsChargeVoteProps> = ({
  costToVote,
  type,
  chainUnitLabel,
  costToVoteError,
  onCostToVoteChange,
  onVoteTypeChange,
}) => {
  const [selected, setSelected] = useState<VoteType>(type);

  const handleVoteTypeChange = (value: VoteType) => {
    setSelected(value);
    onVoteTypeChange?.(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        what is the charge for players to <b>vote</b> in the contest?
      </p>
      <RadioGroup value={selected} onChange={handleVoteTypeChange}>
        <div className="flex flex-col gap-4">
          <RadioGroup.Option value={VoteType.PerTransaction}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-neutral-11 border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-9">
                    a charge <i>each time</i> they vote (recommended)
                  </p>
                  {checked ? (
                    <CreateNumberInput
                      value={costToVote}
                      onChange={onCostToVoteChange}
                      unitLabel={chainUnitLabel}
                      errorMessage={costToVoteError}
                      textClassName="font-bold text-center pl-0 pr-4"
                    />
                  ) : null}
                </div>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={VoteType.PerVote}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-neutral-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-9">
                    a charge per <i>each vote</i> they deploy in contest
                  </p>
                  {checked ? (
                    <CreateNumberInput
                      value={costToVote}
                      onChange={onCostToVoteChange}
                      unitLabel={chainUnitLabel}
                      errorMessage={costToVoteError}
                      textClassName="font-bold text-center pl-0 pr-4"
                    />
                  ) : null}
                </div>
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ContestParamsChargeVote;
