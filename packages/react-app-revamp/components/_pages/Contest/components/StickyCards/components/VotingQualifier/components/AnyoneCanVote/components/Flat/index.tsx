import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";
import VotingQualifierBalance from "../../../../shared/Balance";

const VotingQualifierAnyoneCanVoteFlat = () => {
  const chainNativeCurrencySymbol = useContestConfigStore(
    useShallow(state => state.contestConfig.chainNativeCurrencySymbol),
  );
  const { costToVote } = useContestStore(
    useShallow(state => ({
      costToVote: state.charge.type.costToVote,
    })),
  );
  const costToVoteFormatted = formatEther(BigInt(costToVote));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <img src="/contest/ballot.svg" width={16} height={16} alt="timer" />
        <p className="text-[12px] md:text-[16px] font-bold text-neutral-9">my wallet</p>
        <span className="hidden md:flex text-[16px] text-neutral-9">|</span>
        <p className="hidden md:flex text-[16px] text-neutral-9">
          1 vote = {costToVoteFormatted} {chainNativeCurrencySymbol}
        </p>
      </div>
      <VotingQualifierBalance />
    </div>
  );
};

export default VotingQualifierAnyoneCanVoteFlat;
