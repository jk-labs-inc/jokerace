import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";

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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const title = isMobile ? "how many submissions do you take?" : "how many total submissions does your contest accept?";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">{title}</p>
      <div className="flex flex-col gap-2 w-2/3 md:w-full">
        <CreateNumberInput
          value={maxSubmissions}
          onChange={onMaxSubmissionsChange}
          errorMessage={submissionsPerContestError}
          textClassName="font-bold text-center pl-0 pr-4"
          disableDecimals
        />
      </div>
    </div>
  );
};

export default ContestParamsSubmissionsPerContest;
