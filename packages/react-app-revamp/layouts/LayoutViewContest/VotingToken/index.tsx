import { useStore } from "@hooks/useContest/store";
import { isAfter, isBefore } from "date-fns";
import shallow from "zustand/shallow";

export const VotingToken = () => {
  const { currentUserTotalVotesCast, votingToken, votesClose, votesOpen, currentUserAvailableVotesAmount } = useStore(
    state => ({
      //@ts-ignore,
      votesClose: state.votesClose,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votingToken: state.votingToken,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      currentUserTotalVotesCast: state.currentUserTotalVotesCast,
    }),
    shallow,
  );
  return (
    <>
      <div className="font-black leading-snug flex flex-wrap space-i-1ex md:space-i-0 md:flex-col items-center slashed-zero tabular-nums">
        <span className="text-sm font-bold pb-0.5">
          {isBefore(new Date(), votesOpen)
            ? "Your available votes"
            : isAfter(new Date(), votesClose)
            ? "Your used votes:"
            : "Your remaining votes:"}
        </span>
        {isBefore(new Date(), votesOpen) ? (
          <>
            <span
              title={new Intl.NumberFormat().format(currentUserAvailableVotesAmount)}
              className="text-center text-md text-true-white pt-2"
            >
              <span aria-hidden="true" className="hidden md:inline-block">
                {currentUserAvailableVotesAmount > 1000000000
                  ? new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 3,
                    }).format(parseFloat(currentUserAvailableVotesAmount))
                  : parseFloat(currentUserAvailableVotesAmount.toFixed(5))}
              </span>
              <span className="md:hidden">{parseFloat(currentUserAvailableVotesAmount.toFixed(5))}</span>
            </span>
          </>
        ) : isBefore(new Date(), votesClose) ? (
          <>
            <span title={new Intl.NumberFormat().format(currentUserAvailableVotesAmount)} className="text-lg">
              <span aria-hidden="true" className="hidden md:inline-block">
                {currentUserAvailableVotesAmount > 1000000000
                  ? Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 3,
                    }).format(parseFloat(currentUserAvailableVotesAmount))
                  : parseFloat(currentUserAvailableVotesAmount.toFixed(5))}
              </span>
              <span className="md:hidden">
                {new Intl.NumberFormat("en-US").format(currentUserAvailableVotesAmount)}
              </span>
            </span>
            <span
              title={new Intl.NumberFormat().format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)}
              className="text-center text-md text-neutral-8"
            >
              <span className="px-[0.5ex]">out of</span>
              <span aria-hidden="true" className="hidden md:inline-block">
                {currentUserAvailableVotesAmount + currentUserTotalVotesCast > 1000000000
                  ? new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 3,
                    }).format(parseFloat(currentUserAvailableVotesAmount + currentUserTotalVotesCast))
                  : new Intl.NumberFormat("en-US").format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)}
              </span>
              <span className="md:hidden">
                {new Intl.NumberFormat("en-US").format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)}
              </span>
            </span>
          </>
        ) : (
          <>
            <span title={new Intl.NumberFormat().format(currentUserAvailableVotesAmount)} className="text-lg">
              <span aria-hidden="true" className="hidden md:inline-block">
                {currentUserAvailableVotesAmount > 1000000000
                  ? Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 3,
                    }).format(parseFloat(currentUserAvailableVotesAmount))
                  : new Intl.NumberFormat("en-US").format(currentUserAvailableVotesAmount)}
              </span>
              <span className="md:hidden">
                {new Intl.NumberFormat("en-US").format(currentUserAvailableVotesAmount)}
              </span>
            </span>
            <span
              title={new Intl.NumberFormat().format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)}
              className="text-center text-md text-neutral-8"
            >
              <span className="px-[0.5ex]">out of</span>
              <span aria-hidden="true" className="hidden md:inline-block">
                {currentUserAvailableVotesAmount + currentUserTotalVotesCast > 1000000000
                  ? new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 3,
                    }).format(parseFloat(currentUserAvailableVotesAmount + currentUserTotalVotesCast))
                  : new Intl.NumberFormat("en-US").format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)}
              </span>
              <span className="md:hidden">
                {new Intl.NumberFormat("en-US").format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)}
              </span>
            </span>
          </>
        )}
        <span className="text-xs font-bold text-neutral-7">${votingToken?.symbol}</span>
      </div>
    </>
  );
};

export default VotingToken;
