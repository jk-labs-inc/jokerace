import { FC } from "react";
import { Abi } from "viem";
import RewardsSplitLayout from "../shared/Layout";
import WinnersRewardsPageCreatorView from "./Creator";
import WinnersRewardsPagePlayerView from "./Player";
interface WinnersRewardsPageProps {
  contestAddress: `0x${string}`;
  chainId: number;
  contestRewardsModuleAddress: `0x${string}`;
  contestAbi: Abi;
  rewardsModuleAbi: Abi;
  version: string;
}

const WinnersRewardsPage: FC<WinnersRewardsPageProps> = ({
  contestAddress,
  chainId,
  contestRewardsModuleAddress,
  contestAbi,
  rewardsModuleAbi,
  version,
}) => {
  return (
    <RewardsSplitLayout
      playerView={
        <WinnersRewardsPagePlayerView
          contestAbi={contestAbi}
          contestRewardsModuleAddress={contestRewardsModuleAddress}
          rewardsModuleAbi={rewardsModuleAbi}
          contestAddress={contestAddress as `0x${string}`}
          chainId={chainId}
        />
      }
      creatorView={
        <WinnersRewardsPageCreatorView
          contestRewardsModuleAddress={contestRewardsModuleAddress}
          rewardsModuleAbi={rewardsModuleAbi}
          chainId={chainId}
          version={version}
        />
      }
    />
  );
};

export default WinnersRewardsPage;
