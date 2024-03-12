import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";

interface ContestParamsSubmissionsPerPlayerProps {
  allowedSubmissionsPerUser: number;
  submissionsPerUserError: string;
  onSubmissionsPerUserChange: (value: number | null) => void;
}

const ContestParamsSubmissionsPerPlayer: FC<ContestParamsSubmissionsPerPlayerProps> = ({
  allowedSubmissionsPerUser,
  submissionsPerUserError,
  onSubmissionsPerUserChange,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const title = isMobile ? "how many times can someone submit?" : "how many submissions can each player enter?";
  const displayMax = allowedSubmissionsPerUser < MAX_SUBMISSIONS_LIMIT;

  const handleMaxClick = () => {
    onSubmissionsPerUserChange(MAX_SUBMISSIONS_LIMIT);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">{title}</p>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-2 w-2/3 md:w-auto">
          <CreateNumberInput
            value={allowedSubmissionsPerUser}
            onChange={onSubmissionsPerUserChange}
            errorMessage={submissionsPerUserError}
            textClassName="font-bold text-center pl-0 pr-4"
            disableDecimals
          />
        </div>
        {displayMax ? (
          <div
            className="w-16 text-center rounded-[10px] border items-center border-positive-11  hover:border-2 cursor-pointer"
            onClick={handleMaxClick}
          >
            <p className="text-[16px] text-positive-11 infinite-submissions uppercase">max</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContestParamsSubmissionsPerPlayer;
