import { FC } from "react";
import { Abi } from "viem";
import RewardsSplitLayout from "../shared/Layout";
import WinnersRewardsPageCreatorView from "./Creator";
import WinnersRewardsPagePlayerView from "./Player";
import { RewardModuleInfo } from "lib/rewards/types";
interface WinnersRewardsPageProps {
  rewards: RewardModuleInfo;
  contestAddress: `0x${string}`;
  chainId: number;
  contestAbi: Abi;
  version: string;
}

const WinnersRewardsPage: FC<WinnersRewardsPageProps> = ({ rewards, contestAddress, contestAbi, chainId, version }) => {
  return (
    <RewardsSplitLayout
      playerView={
        <WinnersRewardsPagePlayerView
          rewards={rewards}
          contestAbi={contestAbi}
          contestAddress={contestAddress as `0x${string}`}
          chainId={chainId}
        />
      }
      creatorView={<WinnersRewardsPageCreatorView rewards={rewards} chainId={chainId} version={version} />}
    />
  );
};

export default WinnersRewardsPage;
