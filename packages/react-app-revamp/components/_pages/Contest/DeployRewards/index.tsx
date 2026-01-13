import { useContestStore } from "@hooks/useContest/store";
import { useConnection } from "wagmi";
import { useShallow } from "zustand/shallow";
import ContestDeployRewardsUnderConstruction from "./components/UnderConstruction";
import { useDeployRewards } from "./hooks/useDeployRewards";
import { RewardsDeploymentStatus } from "./components/DeploymentStatus";
import { ConfigurationForm } from "./components/ConfigurationForm";

const ContestDeployRewards = () => {
  const { address: connectedAccountAddress } = useConnection();
  const contestAuthorEthereumAddress = useContestStore(useShallow(state => state.contestAuthorEthereumAddress));
  const isCreator = connectedAccountAddress === contestAuthorEthereumAddress;
  const { deployRewards, isDeploying, deploymentProcess, addFundsToRewards } = useDeployRewards();

  if (!isCreator) {
    return (
      <div className="mt-6 md:mt-12">
        <ContestDeployRewardsUnderConstruction />
      </div>
    );
  }

  const isDeploymentInProgress =
    isDeploying ||
    (deploymentProcess.phase !== "idle" &&
      deploymentProcess.phase !== "completed" &&
      deploymentProcess.phase !== "failed");

  if (isDeploymentInProgress) {
    return (
      <div className="mt-6 md:mt-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[24px] font-bold text-neutral-11">add rewards for voters</p>
          </div>
          <RewardsDeploymentStatus deploymentProcess={deploymentProcess} addFundsToRewards={addFundsToRewards} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 md:mt-12 animate-fade-in">
      <ConfigurationForm onDeploy={deployRewards} isDeploying={isDeploying} />
    </div>
  );
};

export default ContestDeployRewards;
