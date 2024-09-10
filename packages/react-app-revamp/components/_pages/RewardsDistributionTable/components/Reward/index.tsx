import { TokenInfo } from "@hooks/useReleasableRewards";
import { DistributableReward } from "./components/DistributableReward";

export interface RewardProps {
  token: TokenInfo;
  handleDistributeRewards?: () => Promise<void>;
}

export const Reward = (props: RewardProps) => {
  const { token, handleDistributeRewards } = props;

  return <DistributableReward token={token} handleDistributeRewards={handleDistributeRewards} />;
};

export default Reward;
