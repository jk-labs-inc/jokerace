import { toastInfo } from "@components/UI/Toast";
import { getTotalCharge } from "@helpers/totalCharge";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { switchChain } from "@wagmi/core";
import { config } from "@config/wagmi";

interface UseVoteExecutionProps {
  amount: number;
  amountOfVotes: number;
  isCorrectNetwork: boolean;
  contestChainId: number;
  isVotingClosed: boolean;
  onVote?: (amount: number) => void;
  onSwitchChain?: (chainId: number) => Promise<void>;
  onCancelMaxVotes?: () => void;
}

interface UseVoteExecutionReturn {
  showMaxVotesDialog: boolean;
  handleVote: () => Promise<void>;
  handleMaxVoteConfirm: () => void;
  handleMaxVoteCancel: () => void;
  getTotalCost: () => string;
}

export const useVoteExecution = ({
  amount,
  amountOfVotes,
  isCorrectNetwork,
  contestChainId,
  isVotingClosed,
  onVote,
  onCancelMaxVotes,
}: UseVoteExecutionProps): UseVoteExecutionReturn => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  //TODO: we need to pass this info instead of getting it from the store
  const { votingClose } = useContestStore(useShallow(state => ({ votingClose: state.votesClose })));
  const [showMaxVotesDialog, setShowMaxVotesDialog] = useState(false);
  const { currentPricePerVote } = useCurrentPricePerVoteWithRefetch({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose,
  });

  const onSwitchNetwork = async (chainId: number) => {
    await switchChain(config, { chainId });
  };

  const handleVote = async () => {
    if (!isCorrectNetwork) {
      await onSwitchNetwork(contestChainId);
    }

    if (isVotingClosed) {
      toastInfo({
        message: "Voting is closed for this contest",
      });
      return;
    }

    if (amount === amountOfVotes) {
      setShowMaxVotesDialog(true);
      return;
    }

    onVote?.(amount);
  };

  const handleMaxVoteConfirm = () => {
    setShowMaxVotesDialog(false);
    onVote?.(amount);
  };

  const handleMaxVoteCancel = () => {
    setShowMaxVotesDialog(false);
    onCancelMaxVotes?.();
  };

  const getTotalCost = () => {
    if (!currentPricePerVote || !amount) return "0";
    return getTotalCharge(amount, currentPricePerVote);
  };

  return {
    showMaxVotesDialog,
    handleVote,
    handleMaxVoteConfirm,
    handleMaxVoteCancel,
    getTotalCost,
  };
};
