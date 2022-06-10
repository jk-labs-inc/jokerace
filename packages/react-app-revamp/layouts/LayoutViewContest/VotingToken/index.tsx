import { useStore } from "@hooks/useProviderContest";

export const VotingToken = () => {
  const stateContest = useStore();

  return (
    <>
      <div className="font-black leading-snug flex flex-wrap space-i-1ex md:space-i-0 md:flex-col items-center slashed-zero tabular-nums">
        <span className="text-sm font-bold">Votes remaining:</span>
        <span className="text-lg">{new Intl.NumberFormat().format(stateContest.currentUserAvailableVotesAmount)}</span>
        <span className="text-md text-neutral-8">
          of {new Intl.NumberFormat().format(stateContest.votingToken?.totalSupply?.formatted)}
        </span>
        <span className="text-xs font-bold text-neutral-7">${stateContest.votingToken?.symbol}</span>
      </div>
    </>
  );
};

export default VotingToken;
