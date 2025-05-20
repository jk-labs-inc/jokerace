import { FC } from "react";
import { Abi } from "viem";
import RewardsCreatorView from "../../shared/CreatorView";

interface VotersRewardsPageCreatorViewProps {
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  chainId: number;
  version: string;
}

const VotersRewardsPageCreatorView: FC<VotersRewardsPageCreatorViewProps> = ({
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

export default VotersRewardsPageCreatorView;
