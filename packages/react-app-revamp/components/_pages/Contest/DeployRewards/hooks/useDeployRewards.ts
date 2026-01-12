import { useFundPoolStore } from "@components/_pages/Create/pages/ContestRewards/components/FundPool/store";
import { config } from "@config/wagmi";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { orchestrateRewardsDeployment } from "@hooks/useDeployContest/deployment/process/orchestrator";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useError } from "@hooks/useError";
import useRewardsModule from "@hooks/useRewards";
import { switchChain } from "@wagmi/core";
import { useState } from "react";
import { useConnection } from "wagmi";
import { useShallow } from "zustand/shallow";

export const useDeployRewards = () => {
  const { address: connectedAccountAddress, chainId: connectedAccountChainId } = useConnection();
  const contestConfig = useContestConfigStore(state => state.contestConfig);
  const {
    rewardPoolData,
    addFundsToRewards,
    deploymentProcess,
    setDeploymentPhase,
    setTransactionState,
    setFundTokenTransaction,
    setRewardsModuleAddress,
    resetStore,
  } = useDeployContestStore(
    useShallow(state => ({
      rewardPoolData: state.rewardPoolData,
      addFundsToRewards: state.addFundsToRewards,
      deploymentProcess: state.deploymentProcess,
      setDeploymentPhase: state.setDeploymentPhase,
      setTransactionState: state.setTransactionState,
      setFundTokenTransaction: state.setFundTokenTransaction,
      setRewardsModuleAddress: state.setRewardsModuleAddress,
      resetStore: state.resetStore,
    })),
  );
  const { tokenWidgets, setTokenWidgets, setIsError } = useFundPoolStore(
    useShallow(state => ({
      tokenWidgets: state.tokenWidgets,
      setTokenWidgets: state.setTokenWidgets,
      setIsError: state.setIsError,
    })),
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const { refetch: refetchRewardsModule } = useRewardsModule();
  const isConnectedOnCorrectChain = connectedAccountChainId === contestConfig.chainId;
  const { handleError } = useError();

  const deployRewards = async () => {
    if (!connectedAccountAddress || !contestConfig.address || !contestConfig.chainId) {
      return;
    }

    if (!isConnectedOnCorrectChain) {
      await switchChain(config, { chainId: contestConfig.chainId });
    }

    setIsDeploying(true);

    try {
      await orchestrateRewardsDeployment({
        contestAddress: contestConfig.address,
        chainId: contestConfig.chainId,
        userAddress: connectedAccountAddress,
        rewardPoolData,
        tokenWidgets,
        addFundsToRewards,
        onPhaseChange: setDeploymentPhase,
        onTransactionUpdate: setTransactionState,
        onFundTokenUpdate: setFundTokenTransaction,
        onRewardsModuleAddress: setRewardsModuleAddress,
        onCriticalPhaseComplete: async () => {
          setIsDeploying(false);
          refetchRewardsModule();
          resetStore();
          setTokenWidgets([]);
          setIsError(false);
        },
      });
    } catch (error) {
      handleError(error, "Rewards deployment failed");
      setIsDeploying(false);
      resetStore();
      setTokenWidgets([]);
      setIsError(false);
      throw error;
    }
  };

  return {
    deployRewards,
    isDeploying,
    deploymentProcess,
    addFundsToRewards,
  };
};
