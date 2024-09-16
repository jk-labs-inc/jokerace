import GradientText from "@components/UI/GradientText";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { FC } from "react";
import CancelContest from "../CancelContest";
import { useMediaQuery } from "react-responsive";

interface ContestNameProps {
  contestName: string;
}

const ContestName: FC<ContestNameProps> = ({ contestName }) => {
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className={`flex items-center justify-between md:justify-normal`}>
      {!isMobile && <CancelContest />}
      <GradientText text={contestName} isStrikethrough={isContestCanceled} />
      {isMobile && <CancelContest />}
    </div>
  );
};

export default ContestName;
