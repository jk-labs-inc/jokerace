import { toastInfo } from "@components/UI/Toast";
import { useVotingStore } from "@components/Voting/store";
import { config } from "@config/wagmi";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { switchChain } from "@wagmi/core";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

interface UseVoteExecutionProps {
  maxBalance: string;
  costToVote: string;
  isVotingClosed: boolean;
  onVote?: (amountOfVotes: number) => void;
  onCancelMaxVotes?: () => void;
}

interface UseVoteExecutionReturn {
  showMaxVotesDialog: boolean;
  handleVote: () => Promise<void>;
  handleMaxVoteConfirm: () => void;
  handleMaxVoteCancel: () => void;
}

export const useVoteExecution = ({
  maxBalance,
  costToVote,
  isVotingClosed,
  onVote,
  onCancelMaxVotes,
}: UseVoteExecutionProps): UseVoteExecutionReturn => {
  const { chainId } = useAccount();
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const isCorrectNetwork = chainId === contestConfig.chainId;
  const [showMaxVotesDialog, setShowMaxVotesDialog] = useState(false);
  const inputValue = useVotingStore(useShallow(state => state.inputValue));

  const onSwitchNetwork = async (chainId: number) => {
    await switchChain(config, { chainId });
  };

  const getVotesFromBalance = (): number => {
    const balanceInput = parseFloat(inputValue);
    if (isNaN(balanceInput) || balanceInput === 0 || Number(costToVote) === 0) {
      return 0;
    }

    return Math.floor(balanceInput / Number(costToVote));
  };

  const handleVote = async () => {
    if (!isCorrectNetwork) {
      await onSwitchNetwork(contestConfig.chainId);
    }

    if (isVotingClosed) {
      toastInfo({
        message: "Voting is closed for this contest",
      });
      return;
    }

    const amountOfVotes = getVotesFromBalance();
    const maxBalanceNum = parseFloat(maxBalance);
    const inputBalanceNum = parseFloat(inputValue);

    // Check if user is voting with max balance
    if (inputBalanceNum >= maxBalanceNum) {
      setShowMaxVotesDialog(true);
      return;
    }

    onVote?.(amountOfVotes);
  };

  const handleMaxVoteConfirm = () => {
    setShowMaxVotesDialog(false);
    const amountOfVotes = getVotesFromBalance();
    onVote?.(amountOfVotes);
  };

  const handleMaxVoteCancel = () => {
    setShowMaxVotesDialog(false);
    onCancelMaxVotes?.();
  };

  return {
    showMaxVotesDialog,
    handleVote,
    handleMaxVoteConfirm,
    handleMaxVoteCancel,
  };
};
