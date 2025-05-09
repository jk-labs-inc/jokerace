import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { formatBalance } from "@helpers/formatBalance";
import { CreationStep, useCreateRewardsStore } from "../../store";
import { useFundPoolStore } from "../FundPool/store";
import { useShallow } from "zustand/shallow";
import MotionSpinner from "@components/UI/MotionSpinner";
import { motion } from "motion/react";

type TransactionKey = "deploy" | "attach" | `fund_${string}` | "setCreatorSplitDestination";

interface Transaction {
  key: TransactionKey;
  label: string | React.ReactNode;
}

const baseTransactions: Transaction[] = [
  { key: "deploy", label: "Deploying rewards pool..." },
  { key: "attach", label: "Attaching rewards pool to the contest..." },
];

const CreateRewardsDeploymentStatus: React.FC = () => {
  const { rewardPoolData, addEarningsToRewards, setStep } = useCreateRewardsStore(
    useShallow(state => ({
      rewardPoolData: state.rewardPoolData,
      addEarningsToRewards: state.addEarningsToRewards,
      setStep: state.setStep,
    })),
  );
  const { tokenWidgets } = useFundPoolStore(state => state);

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

  const creatorSplitTransaction: Transaction = {
    key: "setCreatorSplitDestination",
    label: "setting charges to go to rewards pool...",
  };

  const transactions: Transaction[] = [
    ...baseTransactions,
    ...tokenTransactions,
    ...(addEarningsToRewards ? [creatorSplitTransaction] : []),
  ];

  const shouldBeActive = (index: number): boolean => {
    const prevTransaction = transactions[index - 1];
    if (!prevTransaction) return true;

    const prevState = rewardPoolData[prevTransaction.key];
    if (prevState && "success" in prevState) {
      return prevState.success;
    }

    return false;
  };

  const renderTransactionStatus = (transactionKey: TransactionKey) => {
    const state = rewardPoolData[transactionKey];
    if (state?.loading) return <MotionSpinner size={24} theme="light" />;
    if (state?.success) return <CheckCircleIcon className="text-positive-11 w-6 h-6" />;
    if (state?.error) return <XCircleIcon className="text-negative-11 w-6 h-6" />;
    return null;
  };

  const hasError = transactions.some(tx => rewardPoolData[tx.key]?.error);

  const handleGoBack = () => {
    setStep(CreationStep.Review);
  };

  return (
    <div className="flex flex-col gap-11">
      <p className="text-[24px] text-true-white font-bold">Let's Deploy</p>
      <div className="flex flex-col gap-4 w-full md:w-2/3">
        {transactions.map((transaction, index) => {
          const state = rewardPoolData[transaction.key];
          const isActive = shouldBeActive(index);

          return (
            <motion.div
              key={transaction.key}
              className="flex items-center justify-between border-b pb-2"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.4,
                borderColor: state?.loading
                  ? "#3A3E44" // border-primary-2
                  : state?.success
                    ? "#78FFC6" // border-positive-11
                    : state?.error
                      ? "#E04D65" // border-negative-11
                      : "#3A3E44", // border-primary-2
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <p className="text-[16px] text-neutral-11">{transaction.label}</p>
              {renderTransactionStatus(transaction.key)}
            </motion.div>
          );
        })}
        {hasError && (
          <button className="flex items-center gap-[5px] cursor-pointer group" onClick={handleGoBack}>
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

export default CreateRewardsDeploymentStatus;
