import { FC } from "react";
import { Abi } from "viem";
import RewardsSplitLayout from "../shared/Layout";
import VoterRewardsPageCreatorView from "./Creator";
import VoterRewardsPagePlayerView from "./Player";

interface VotersRewardsPageProps {
  contestAddress: `0x${string}`;
  chainId: number;
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  version: string;
}

const VotersRewardsPage: FC<VotersRewardsPageProps> = ({
  contestAddress,
  chainId,
  contestRewardsModuleAddress,
  rewardsModuleAbi,
  version,
}) => {
  return (
    <RewardsSplitLayout
      playerView={
        <VoterRewardsPagePlayerView
          contestRewardsModuleAddress={contestRewardsModuleAddress}
          rewardsModuleAbi={rewardsModuleAbi}
          contestAddress={contestAddress as `0x${string}`}
          chainId={chainId}
        />
      }
      creatorView={
        <VoterRewardsPageCreatorView
          contestRewardsModuleAddress={contestRewardsModuleAddress}
          rewardsModuleAbi={rewardsModuleAbi}
          chainId={chainId}
          version={version}
        />
      }
    />
  );
};

export default VotersRewardsPage;
