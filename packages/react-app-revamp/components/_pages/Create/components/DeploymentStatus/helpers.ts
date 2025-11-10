import { DeploymentProcessState, TransactionState } from "@hooks/useDeployContest/types";
import { TransactionKey } from "./types";

export const getTransactionStatus = (
  transactionKey: TransactionKey,
  deploymentProcess: DeploymentProcessState,
): TransactionState | null => {
  if (transactionKey === "deployContest") {
    return deploymentProcess.transactions.deployContest;
  }
  if (transactionKey === "deployRewards") {
    return deploymentProcess.transactions.deployRewards;
  }
  if (transactionKey === "attachRewards") {
    return deploymentProcess.transactions.attachRewards;
  }
  if (transactionKey.startsWith("fund_")) {
    return deploymentProcess.transactions.fundTokens[transactionKey] || null;
  }
  return null;
};
