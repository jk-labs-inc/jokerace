import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/react/shallow";

interface VotingQualifierAllowlistedBalanceProps {
  userAddress: `0x${string}`;
}

const VotingQualifierAllowlistedBalance: FC<VotingQualifierAllowlistedBalanceProps> = ({ userAddress }) => {
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(
    useShallow(state => ({
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      currentUserTotalVotesAmount: state.currentUserTotalVotesAmount,
    })),
  );
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const votingOpen = contestStatus === ContestStatus.VotingOpen;
  const canVote = currentUserAvailableVotesAmount > 0;
  const outOfVotes = currentUserTotalVotesAmount > 0 && !canVote;
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (outOfVotes) return <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">you're out of votes :(</p>;

  if (!canVote) return <p className="text-[16px] md:text-[24px] text-secondary-11 font-bold">ineligible to vote</p>;

  if (canVote && votingOpen) {
    return (
      <p className="text-[16px] md:text-[24px] text-neutral-11 font-bold">
        {formatNumberAbbreviated(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"}{" "}
        left
      </p>
    );
  }

  if (canVote) {
    return (
      <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">
        {formatNumberAbbreviated(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"}{" "}
        {isMobile ? "to use" : "to deploy"}
      </p>
    );
  }
};

export default VotingQualifierAllowlistedBalance;
