import { useStore } from "@hooks/useContest/store";
import { isAfter } from "date-fns";
import shallow from "zustand/shallow";

export const VotingToken = () => {
  const { votingToken, votesClose, currentUserAvailableVotesAmount } = useStore(
    state => ({
      //@ts-ignore
      votingToken: state.votingToken,
      //@ts-ignore
      votesClose: state.votesClose,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
    }),
    shallow,
  );

  return (
    <>
      <div className="font-black leading-snug flex flex-wrap space-i-1ex md:space-i-0 md:flex-col items-center slashed-zero tabular-nums">
        <span className="text-sm font-bold">
          {isAfter(new Date(), votesClose) ? "Used votes:" : "Votes remaining:"}
        </span>
        <span title={new Intl.NumberFormat().format(currentUserAvailableVotesAmount)} className="text-lg">
          <span aria-hidden="true" className="hidden md:inline-block">
            {currentUserAvailableVotesAmount > 1000000000
              ? Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 3,
                }).format(parseFloat(currentUserAvailableVotesAmount))
              : new Intl.NumberFormat().format(currentUserAvailableVotesAmount)}
          </span>
          <span className="md:hidden">{new Intl.NumberFormat().format(currentUserAvailableVotesAmount)}</span>
        </span>
        <span
          title={new Intl.NumberFormat().format(votingToken?.totalSupply?.formatted)}
          className="text-center text-md text-neutral-8"
        >
          <span className="px-1ex">of</span>
          <span aria-hidden="true" className="hidden md:inline-block">
            {votingToken?.totalSupply?.formatted > 1000000000
              ? new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 3,
                }).format(parseFloat(votingToken?.totalSupply?.formatted))
              : new Intl.NumberFormat().format(votingToken?.totalSupply?.formatted)}
          </span>
          <span className="md:hidden">{new Intl.NumberFormat().format(votingToken?.totalSupply?.formatted)}</span>
        </span>
        <span className="text-xs font-bold text-neutral-7">${votingToken?.symbol}</span>
      </div>
    </>
  );
};

export default VotingToken;
