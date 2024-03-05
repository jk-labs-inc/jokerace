import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
import { FC } from "react";

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
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">how many submissions can each player enter?</p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={allowedSubmissionsPerUser}
          onChange={onSubmissionsPerUserChange}
          errorMessage={submissionsPerUserError}
          textClassName="font-bold text-center pl-0 pr-4"
          disableDecimals
        />
      </div>
    </div>
  );
};

export default ContestParamsSubmissionsPerPlayer;
