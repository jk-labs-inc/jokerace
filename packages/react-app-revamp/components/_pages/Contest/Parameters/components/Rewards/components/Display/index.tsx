import { FC } from "react";
import RewardsParametersTable from "../Table";
import RewardsParametersInfo from "../Info";
import { Charge } from "@hooks/useDeployContest/types";
import { ModuleType, RewardModuleInfo } from "lib/rewards/types";
interface RewardsParametersDisplayProps {
  rewardsStore: RewardModuleInfo;
  chainId: number;
  charge: Charge;
}

const RewardsParametersDisplay: FC<RewardsParametersDisplayProps> = ({ rewardsStore, chainId, charge }) => {
  const rewardsType = rewardsStore.moduleType === ModuleType.VOTER_REWARDS ? "voters" : "winners";

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[24px] text-neutral-11">rewards for {rewardsType}</p>
      <RewardsParametersTable rewardsStore={rewardsStore} chainId={chainId} />
      <RewardsParametersInfo rewardsStore={rewardsStore} charge={charge} chainId={chainId} />
    </div>
  );
};

export default RewardsParametersDisplay;
