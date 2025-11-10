import { DeploymentProcessState } from "@hooks/useDeployContest/types";

export type TransactionKey = "deployContest" | "deployRewards" | "attachRewards" | `fund_${string}`;

export interface Transaction {
  key: TransactionKey;
  label: string | React.ReactNode;
}

export interface DeploymentStatusProps {
  deploymentProcess: DeploymentProcessState;
  addFundsToRewards: boolean;
  onGoBack?: () => void;
}
