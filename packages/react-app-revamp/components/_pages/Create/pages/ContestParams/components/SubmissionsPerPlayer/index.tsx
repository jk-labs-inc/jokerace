import CreateNumberInput from "@components/_pages/Create/components/NumberInput";
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
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">{title}</p>
      <div className="flex flex-col gap-20 w-2/3 md:w-full">
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
