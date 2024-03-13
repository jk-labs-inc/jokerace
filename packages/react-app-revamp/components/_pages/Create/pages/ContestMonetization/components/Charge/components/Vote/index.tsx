import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { RadioGroup } from "@headlessui/react";
import { VoteType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface ContestParamsChargeVoteProps {
  costToVote: number;
  type: VoteType;
  chainUnitLabel: string;
  costToVoteError: string;
  isAnyoneCanVote: boolean;
  onCostToVoteChange?: (value: number | null) => void;
  onVoteTypeChange?: (value: VoteType) => void;
}

const ContestParamsChargeVote: FC<ContestParamsChargeVoteProps> = ({
  costToVote,
  type,
  chainUnitLabel,
  costToVoteError,
  isAnyoneCanVote,
  onCostToVoteChange,
  onVoteTypeChange,
}) => {
  const [selected, setSelected] = useState<VoteType>(type);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const handleVoteTypeChange = (value: VoteType) => {
    setSelected(value);
    onVoteTypeChange?.(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        {isMobile ? (
          <>
            what is the charge to <b>vote</b>?
          </>
        ) : (
          <>
            what is the charge for players to <b>vote</b> in the contest?
          </>
        )}
      </p>
      <RadioGroup value={selected} onChange={handleVoteTypeChange}>
        <div className={`flex ${isAnyoneCanVote ? "flex-col-reverse" : "flex-col"} gap-4`}>
          <RadioGroup.Option value={VoteType.PerTransaction} disabled={isAnyoneCanVote}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-full transition-colors ${
                    checked ? "bg-neutral-11 border-0" : ""
                  } ${isAnyoneCanVote ? "opacity-50" : "opacity-100"}`}
                ></div>
                <div className={`flex flex-col ${isAnyoneCanVote ? "gap-1" : "gap-4"}`}>
                  <p className={`text-[20px] text-neutral-9 ${isAnyoneCanVote ? "opacity-50" : "opacity-100"}`}>
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
                  {isAnyoneCanVote ? (
                    <p className="text-[14px] text-neutral-11">
                      <b>note:</b> in order to enable this charge, please use <br />
                      presets or allowlists for voters instead of anyone-can-vote.
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={VoteType.PerVote}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-full transition-colors ${
                    checked ? "bg-neutral-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-9">
                    {isMobile ? (
                      <>
                        a charge per <i>each vote</i>
                      </>
                    ) : (
                      <>
                        a charge per <i>each vote</i> they deploy in contest
                      </>
                    )}
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
