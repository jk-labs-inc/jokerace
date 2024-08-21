import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import ClipLoader from "react-spinners/ClipLoader";
import { formatBalance } from "@helpers/formatBalance";
import { useCreateRewardsStore } from "../../store";
import { useFundPoolStore } from "../FundPool/store";

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
  const { rewardPoolData, addEarningsToRewards } = useCreateRewardsStore(state => ({
    rewardPoolData: state.rewardPoolData,
    addEarningsToRewards: state.addEarningsToRewards,
  }));
  const { tokens } = useFundPoolStore(state => state);

  const tokenTransactions: Transaction[] = tokens.map(token => ({
    key: `fund_${token.symbol}` as TransactionKey,
    label: (
      <>
        Funding pool with {formatBalance(token.amount)} <span className="uppercase">{token.symbol}</span>...
      </>
    ),
  }));

  const creatorSplitTransaction: Transaction = {
    key: "setCreatorSplitDestination",
    label: "setting your earnings to go to rewards pool...",
  };

  const transactions: Transaction[] = [
    ...baseTransactions,
    ...tokenTransactions,
    ...(addEarningsToRewards ? [creatorSplitTransaction] : []),
  ];

  const getTransactionClass = (index: number): string => {
    const prevTransaction = transactions[index - 1];
    if (!prevTransaction) return "opacity-100";

    const prevState = rewardPoolData[prevTransaction.key];
    if (prevState && "success" in prevState) {
      return prevState.success ? "opacity-100" : "opacity-40";
    }

    return "opacity-40";
  };

  const getBorderClass = (transactionKey: TransactionKey): string => {
    const state = rewardPoolData[transactionKey];
    if (state?.loading) return "border-primary-2";
    if (state?.success) return "border-positive-11";
    if (state?.error) return "border-negative-11";
    return "border-primary-2";
  };

  const renderTransactionStatus = (transactionKey: TransactionKey) => {
    const state = rewardPoolData[transactionKey];
    if (state?.loading) return <ClipLoader size={24} color="#E5E5E5" />;
    if (state?.success) return <CheckCircleIcon className="text-positive-11 w-6 h-6" />;
    if (state?.error) return <XCircleIcon className="text-negative-11 w-6 h-6" />;
    return null;
  };

  return (
    <div className="flex flex-col gap-11">
      <p className="text-[24px] text-true-white font-bold">Let's Deploy</p>
      <div className="flex flex-col gap-4 w-full md:w-2/3">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.key}
            className={`
              flex items-center justify-between border-b pb-2
              ${getBorderClass(transaction.key)}
              transition-colors duration-300
              ${getTransactionClass(index)}
            `}
          >
            <p className="text-[16px] text-neutral-11">{transaction.label}</p>
            {renderTransactionStatus(transaction.key)}
          </div>
        ))}
      </div>
      <p className="text-[16px] text-neutral-14">note: please do not refresh the page during the deployment process.</p>
    </div>
  );
};

export default CreateRewardsDeploymentStatus;
