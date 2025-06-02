import { FC } from "react";
import { Abi } from "viem";
import AddRewards from "../../../../components/AddRewards";
import CancelRewards from "../../../../components/CancelRewards";

interface RewardsCreatorOptionsProps {
  rewardsAddress: `0x${string}`;
  abi: Abi;
  chainId: number;
  version: string;
}

const RewardsCreatorOptions: FC<RewardsCreatorOptionsProps> = ({ rewardsAddress, abi, chainId, version }) => {
  return (
    <div className="flex flex-col gap-6 items-start">
      <AddRewards />
      <CancelRewards rewardsAddress={rewardsAddress} abi={abi} chainId={chainId} version={version} />
    </div>
  );
};

export default RewardsCreatorOptions;
