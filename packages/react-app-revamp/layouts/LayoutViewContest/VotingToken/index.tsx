import { IconSpinner } from "@components/UI/Icons";
import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "@hooks/useUser/store";
import { isBefore } from "date-fns";

export const VotingToken = () => {
  const { votingToken, votesClose, votesOpen } = useContestStore(state => state);
  const { currentUserTotalVotesCast, currentUserAvailableVotesAmount, isLoading } = useUserStore(state => state);

  return (
    <>
      <div className="font-black leading-snug flex flex-col text-center items-center slashed-zero tabular-nums">
        <span className="text-sm font-bold pb-0.5">
          {isBefore(new Date(), votesClose ?? 0) ? "Your available votes" : "Your remaining votes:"}
        </span>

        {isLoading ? (
          <IconSpinner className="text-sm animate-spin mie-2 2xs:mie-0 2xs:mb-1" />
        ) : isBefore(new Date(), votesOpen ?? 0) ? (
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
                    }).format(currentUserAvailableVotesAmount)
                  : currentUserAvailableVotesAmount}
              </span>
              <span className="md:hidden">{currentUserAvailableVotesAmount}</span>
            </span>
          </>
        ) : isBefore(new Date(), votesClose ?? 0) ? (
          <>
            <span title={new Intl.NumberFormat().format(currentUserAvailableVotesAmount)} className="text-lg">
              <span aria-hidden="true" className="hidden md:inline-block">
                {currentUserAvailableVotesAmount > 1000000000
                  ? Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 3,
                    }).format(currentUserAvailableVotesAmount)
                  : currentUserAvailableVotesAmount}
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
                    }).format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)
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
                    }).format(currentUserAvailableVotesAmount)
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
                    }).format(currentUserAvailableVotesAmount + currentUserTotalVotesCast)
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
