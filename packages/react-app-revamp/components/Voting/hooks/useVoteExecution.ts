import { toastInfo } from "@components/UI/Toast";
import { useVotingStore } from "@components/Voting/store";
import { config } from "@config/wagmi";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { switchChain } from "@wagmi/core";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

interface UseVoteExecutionProps {
  costToVote: string;
  isVotingClosed: boolean;
  onVote?: (amountOfVotes: number) => void;
}

interface UseVoteExecutionReturn {
  handleVote: () => Promise<void>;
}

export const useVoteExecution = ({
  costToVote,
  isVotingClosed,
  onVote,
}: UseVoteExecutionProps): UseVoteExecutionReturn => {
  const { chainId } = useAccount();
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const isCorrectNetwork = chainId === contestConfig.chainId;
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

    onVote?.(amountOfVotes);
  };

  return {
    handleVote,
  };
};
