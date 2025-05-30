import { FC } from "react";
import RewardsCreatorView from "../../shared/CreatorView";
import { RewardModuleInfo } from "lib/rewards/types";

interface VotersRewardsPageCreatorViewProps {
  rewards: RewardModuleInfo;
  chainId: number;
  version: string;
}

const VotersRewardsPageCreatorView: FC<VotersRewardsPageCreatorViewProps> = ({ rewards, chainId, version }) => {
  return <RewardsCreatorView rewards={rewards} chainId={chainId} version={version} />;
};

export default VotersRewardsPageCreatorView;
