import { DeploymentProcessState, DeploymentPhase, TransactionState } from "../types";

export interface DeploymentProcessSlice {
  deploymentProcess: DeploymentProcessState;
  setDeploymentPhase: (phase: DeploymentPhase) => void;
  setTransactionState: (transaction: keyof DeploymentProcessState["transactions"], state: TransactionState) => void;
  setFundTokenTransaction: (tokenKey: string, state: TransactionState) => void;
  setContestAddress: (address: string) => void;
  setRewardsModuleAddress: (address: string) => void;
  setChainId: (chainId: number) => void;
  resetDeploymentProcess: () => void;
}

const createInitialState = (): DeploymentProcessState => ({
  phase: "idle",
  transactions: {
    deployContest: { status: "pending" },
    deployRewards: { status: "pending" },
    attachRewards: { status: "pending" },
    fundTokens: {},
  },
});

export const createDeploymentProcessSlice = (set: any, get: any): DeploymentProcessSlice => ({
  deploymentProcess: createInitialState(),

  setDeploymentPhase: (phase: DeploymentPhase) =>
    set((state: any) => ({
      deploymentProcess: { ...state.deploymentProcess, phase },
    })),

  setTransactionState: (transaction, transactionState) =>
    set((state: any) => ({
      deploymentProcess: {
        ...state.deploymentProcess,
        transactions: {
          ...state.deploymentProcess.transactions,
          [transaction]: transactionState,
        },
      },
    })),

  setFundTokenTransaction: (tokenKey, transactionState) =>
    set((state: any) => ({
      deploymentProcess: {
        ...state.deploymentProcess,
        transactions: {
          ...state.deploymentProcess.transactions,
          fundTokens: {
            ...state.deploymentProcess.transactions.fundTokens,
            [tokenKey]: transactionState,
          },
        },
      },
    })),

  setContestAddress: address =>
    set((state: any) => ({
      deploymentProcess: {
        ...state.deploymentProcess,
        contestAddress: address,
      },
    })),

  setRewardsModuleAddress: address =>
    set((state: any) => ({
      deploymentProcess: {
        ...state.deploymentProcess,
        rewardsModuleAddress: address,
      },
    })),

  setChainId: chainId =>
    set((state: any) => ({
      deploymentProcess: {
        ...state.deploymentProcess,
        chainId,
      },
    })),

  resetDeploymentProcess: () =>
    set({
      deploymentProcess: createInitialState(),
    }),
});
