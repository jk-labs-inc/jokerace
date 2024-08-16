import GradientText from "@components/UI/GradientText";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { FC } from "react";
import CancelContest from "../CancelContest";

interface ContestNameProps {
  contestName: string;
  address: string;
  chainName: string;
}

const ContestName: FC<ContestNameProps> = ({ contestName, address, chainName }) => {
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;

  return (
    <div className="flex items-center justify-between">
      <GradientText text={contestName} isStrikethrough={isContestCanceled} />
      <CancelContest />
    </div>
  );
};

export default ContestName;
