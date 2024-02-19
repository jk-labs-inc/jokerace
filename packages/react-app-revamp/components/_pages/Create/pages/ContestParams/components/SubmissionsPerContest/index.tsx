import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { FC } from "react";

interface ContestParamsSubmissionsPerContestProps {
  maxSubmissions: number;
  submissionsPerContestError: string;
  onMaxSubmissionsChange: (value: number | null) => void;
}

const ContestParamsSubmissionsPerContest: FC<ContestParamsSubmissionsPerContestProps> = ({
  maxSubmissions,
  submissionsPerContestError,
  onMaxSubmissionsChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">how many total submissions does your contest accept?</p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={maxSubmissions}
          onChange={onMaxSubmissionsChange}
          errorMessage={submissionsPerContestError}
          textClassName="font-bold text-center pl-0 pr-4"
        />
      </div>
    </div>
  );
};

export default ContestParamsSubmissionsPerContest;
