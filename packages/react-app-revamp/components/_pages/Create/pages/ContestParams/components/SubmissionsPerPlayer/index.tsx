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
    <div className="flex flex-col gap-6 mt-2">
      <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
        how many submissions can each player enter?
      </p>
      <div className="flex flex-col gap-2">
        <CreateNumberInput
          value={allowedSubmissionsPerUser}
          onChange={onSubmissionsPerUserChange}
          errorMessage={submissionsPerUserError}
        />
      </div>
    </div>
  );
};

export default ContestParamsSubmissionsPerPlayer;
