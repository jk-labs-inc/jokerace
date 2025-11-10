import TransactionStatusIcons from "@components/_pages/Create/components/DeploymentStatus/components/TransactionStatusIcons";
import { getTransactionStatus } from "@components/_pages/Create/components/DeploymentStatus/helpers";
import { Transaction } from "@components/_pages/Create/components/DeploymentStatus/types";
import { DeploymentProcessState } from "@hooks/useDeployContest/types";
import { motion } from "motion/react";
import { FC } from "react";

interface BaseTransactionsProps {
  deploymentProcess: DeploymentProcessState;
  shouldBeActive: (index: number) => boolean;
}

const BaseTransactions: FC<BaseTransactionsProps> = ({ deploymentProcess, shouldBeActive }) => {
  const baseTransactions: Transaction[] = [
    {
      key: "deployContest",
      label: (
        <div className="flex items-center gap-2">
          <span>Laying contest foundations</span>
          <span>🏗️</span>
        </div>
      ),
    },
    {
      key: "deployRewards",
      label: (
        <div className="flex items-center gap-2">
          <span>Deploying rewards pool</span>
          <span>💰</span>
        </div>
      ),
    },
    {
      key: "attachRewards",
      label: (
        <div className="flex items-center gap-2">
          <span>Attaching rewards pool to the contest</span>
          <span>🔗</span>
        </div>
      ),
    },
  ];

  return (
    <>
      {baseTransactions.map((transaction, index) => {
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
                  ? "#3A3E44"
                  : state?.status === "success"
                  ? "#78FFC6"
                  : state?.status === "error"
                  ? "#E04D65"
                  : "#3A3E44",
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <p className="text-[16px] text-neutral-11">{transaction.label}</p>
            <TransactionStatusIcons state={state || { status: "pending" }} />
          </motion.div>
        );
      })}
    </>
  );
};

export default BaseTransactions;
