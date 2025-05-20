import { FC } from "react";
import { Abi } from "viem";
import RewardsCreatorView from "../../shared/CreatorView";

interface WinnersRewardsPageCreatorViewProps {
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  chainId: number;
  version: string;
}

const WinnersRewardsPageCreatorView: FC<WinnersRewardsPageCreatorViewProps> = ({
  contestRewardsModuleAddress,
  rewardsModuleAbi,
  chainId,
  version,
}) => {
  return (
    <RewardsCreatorView
      contestRewardsModuleAddress={contestRewardsModuleAddress}
      rewardsModuleAbi={rewardsModuleAbi}
      chainId={chainId}
      version={version}
    />
  );
};

export default WinnersRewardsPageCreatorView;
