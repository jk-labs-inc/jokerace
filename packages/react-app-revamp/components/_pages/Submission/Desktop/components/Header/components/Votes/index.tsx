import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ordinalize } from "@helpers/ordinalize";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalVotes from "@hooks/useProposalVotes";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubmissionPageDesktopVotes = () => {
  const { contestConfig, proposalId } = useContestConfigStore(state => state);
  const { votes, rank, isTied, isLoading, isError, isRefetching } = useProposalVotes({
    contestAddress: contestConfig.address,
    proposalId: proposalId,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
  });

  if (isLoading || isRefetching) {
    return (
      <SkeletonTheme baseColor="#706f78" highlightColor="#bb65ff" duration={1}>
        <Skeleton width={160} height={32} borderRadius={16} />
      </SkeletonTheme>
    );
  }

  if (isError) {
    return (
      <div className="w-40 h-8 bg-neutral-16 border border-positive-13 rounded-2xl flex items-center justify-center">
        <span className="text-positive-14 text-base font-bold">error</span>
      </div>
    );
  }

  if (votes === 0) return null;

  return (
    <div className="h-8 bg-neutral-16 border border-positive-13 rounded-2xl flex items-center justify-center px-4">
      <span className="text-positive-14 text-base font-bold">
        {rank > 0 ? (
          <>
            {rank}
            <sup>{ordinalize(rank).suffix}</sup> place | {formatNumberAbbreviated(votes)}{" "}
            {votes === 1 ? "vote" : "votes"}
          </>
        ) : (
          `${formatNumberAbbreviated(votes)} ${votes === 1 ? "vote" : "votes"}`
        )}
      </span>
    </div>
  );
};

export default SubmissionPageDesktopVotes;
