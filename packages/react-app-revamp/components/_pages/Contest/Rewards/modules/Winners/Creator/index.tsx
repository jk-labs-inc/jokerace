import { FC } from "react";
import RewardsCreatorView from "../../shared/CreatorView";
import { RewardModuleInfo } from "lib/rewards/types";

interface WinnersRewardsPageCreatorViewProps {
  rewards: RewardModuleInfo;
  chainId: number;
  version: string;
}

const WinnersRewardsPageCreatorView: FC<WinnersRewardsPageCreatorViewProps> = ({ rewards, chainId, version }) => {
  return <RewardsCreatorView rewards={rewards} chainId={chainId} version={version} />;
};

export default WinnersRewardsPageCreatorView;
