import { useVotingStore } from "@components/Voting/store";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { useVotesFromInput } from "@hooks/useVotesFromInput";
import { FC } from "react";
import { useShallow } from "zustand/shallow";

interface TotalVotesProps {
  costToVote: string;
  spendableBalance: string;
}

const TotalVotes: FC<TotalVotesProps> = ({ costToVote, spendableBalance }) => {
  const inputValue = useVotingStore(useShallow(state => state.inputValue));
  const totalVotes = useVotesFromInput({
    costToVote: costToVote,
    inputValue: inputValue,
  });

  return (
    <div className="flex items-center justify-between text-neutral-9 text-[16px]">
      <p className="">total votes</p>
      <p>{formatNumberAbbreviated(totalVotes)}</p>
    </div>
  );
};

export default TotalVotes;
