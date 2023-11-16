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
    <div className="flex flex-col gap-6">
      <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
        how many total submissions does your contest accept?
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={maxSubmissions}
          onChange={onMaxSubmissionsChange}
          errorMessage={submissionsPerContestError}
        />
      </div>
    </div>
  );
};

export default ContestParamsSubmissionsPerContest;
