import Skeleton from "react-loading-skeleton";
import VotingWidgetRewardsProjectionContainer from "../Container";

const VotingWidgetRewardProjectionLoader = () => {
  return (
    <VotingWidgetRewardsProjectionContainer>
      <div className="flex items-center gap-2">
        <Skeleton width={50} height={16} baseColor="#6A6A6A" highlightColor="#84679b" duration={1} />
      </div>
      <div className="ml-auto">
        <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#84679b" duration={1} />
      </div>
    </VotingWidgetRewardsProjectionContainer>
  );
};

export default VotingWidgetRewardProjectionLoader;
