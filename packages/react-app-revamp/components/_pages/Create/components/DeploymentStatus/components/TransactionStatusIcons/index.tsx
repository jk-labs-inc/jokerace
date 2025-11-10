import MotionSpinner from "@components/UI/MotionSpinner";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { TransactionState } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface TransactionStatusIconsProps {
  state: TransactionState;
}

const TransactionStatusIcons: FC<TransactionStatusIconsProps> = ({ state }) => {
  if (!state) return null;
  if (state.status === "loading") return <MotionSpinner size={24} theme="light" />;
  if (state.status === "success") return <CheckCircleIcon className="text-positive-11 w-6 h-6" />;
  if (state.status === "error") return <XCircleIcon className="text-negative-11 w-6 h-6" />;
  return null;
};

export default TransactionStatusIcons;
