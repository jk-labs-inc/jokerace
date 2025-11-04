import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { formatBalance } from "@helpers/formatBalance";
import { useShallow } from "zustand/shallow";
import MotionSpinner from "@components/UI/MotionSpinner";
import { motion } from "motion/react";
import { DeploymentProcessState, TransactionState } from "@hooks/useDeployContest/types";
import { useFundPoolStore } from "@components/_pages/Create/pages/ContestRewards/components/FundPool/store";

type TransactionKey = "deployContest" | "deployRewards" | "attachRewards" | `fund_${string}`;

interface Transaction {
  key: TransactionKey;
  label: string | React.ReactNode;
}

interface DeploymentStatusProps {
  deploymentProcess: DeploymentProcessState;
  addFundsToRewards: boolean;
  onGoBack?: () => void;
}

const getTransactionStatus = (
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

const renderTransactionStatus = (state: TransactionState | null) => {
  if (!state) return null;
  if (state.status === "loading") return <MotionSpinner size={24} theme="light" />;
  if (state.status === "success") return <CheckCircleIcon className="text-positive-11 w-6 h-6" />;
  if (state.status === "error") return <XCircleIcon className="text-negative-11 w-6 h-6" />;
  return null;
};

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  deploymentProcess,
  addFundsToRewards,
  onGoBack,
}) => {
  const { tokenWidgets } = useFundPoolStore(useShallow(state => ({ tokenWidgets: state.tokenWidgets })));

  const baseTransactions: Transaction[] = [
    { key: "deployContest", label: "Deploying contest..." },
    { key: "deployRewards", label: "Deploying rewards pool..." },
    { key: "attachRewards", label: "Attaching rewards pool to the contest..." },
  ];

  const tokenTransactions: Transaction[] = tokenWidgets
    .filter(token => parseFloat(token.amount) > 0)
    .map(token => ({
      key: `fund_${token.symbol}` as TransactionKey,
      label: (
        <>
          Funding pool with {formatBalance(token.amount)} <span className="uppercase">{token.symbol}</span>...
        </>
      ),
    }));

  const transactions: Transaction[] = [...baseTransactions, ...(addFundsToRewards ? tokenTransactions : [])];

  const shouldBeActive = (index: number): boolean => {
    const prevTransaction = transactions[index - 1];
    if (!prevTransaction) return true;

    const prevState = getTransactionStatus(prevTransaction.key, deploymentProcess);
    return prevState?.status === "success";
  };

  const hasError = transactions.some(tx => {
    const state = getTransactionStatus(tx.key, deploymentProcess);
    return state?.status === "error";
  });

  return (
    <div className="flex flex-col gap-11 max-w-[600px]">
      <div className="flex flex-col gap-4 w-full md:w-2/3">
        {transactions.map((transaction, index) => {
          const state = getTransactionStatus(transaction.key, deploymentProcess);
          const isActive = shouldBeActive(index);

          return (
            <motion.div
              key={transaction.key}
              className="flex items-center justify-between border-b pb-2"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.4,
                borderColor:
                  state?.status === "loading"
                    ? "#3A3E44" // border-primary-2
                    : state?.status === "success"
                    ? "#78FFC6" // border-positive-11
                    : state?.status === "error"
                    ? "#E04D65" // border-negative-11
                    : "#3A3E44", // border-primary-2
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <p className="text-[16px] text-neutral-11">{transaction.label}</p>
              {renderTransactionStatus(state)}
            </motion.div>
          );
        })}
        {hasError && onGoBack && (
          <button className="flex items-center gap-[5px] cursor-pointer group" onClick={onGoBack}>
            <div className="transition-transform duration-200 group-hover:-translate-x-1">
              <img src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-1" />
            </div>
            <p className="text-[16px]">go back to review </p>
          </button>
        )}
      </div>
      <p className="text-[16px] text-neutral-14">note: please do not refresh the page during the deployment process.</p>
    </div>
  );
};
