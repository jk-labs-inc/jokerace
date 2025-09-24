import { useEntryContractConfigStore } from "@components/_pages/Submission/hooks/useEntryContractConfig/store";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ordinalize } from "@helpers/ordinalize";
import useProposalVotes from "@hooks/useProposalVotes";

const SubmissionPageDesktopVotes = () => {
  const { contestAddress, contestChainId, contestAbi, proposalId } = useEntryContractConfigStore(state => state);
  const { votes, rank, isTied, isLoading, isError, error, refetch } = useProposalVotes({
    contestAddress: contestAddress,
    proposalId: proposalId,
    chainId: contestChainId,
    abi: contestAbi,
  });

  // TODO: add loading and error states
  if (isLoading) {
    return (
      <div className="w-40 h-8 bg-neutral-16 border border-positive-13 rounded-2xl flex items-center justify-center">
        <span className="text-positive-14 text-base font-bold">loading...</span>
      </div>
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
    <div className="h-8 bg-neutral-16 border border-positive-13 rounded-2xl flex items-center justify-center px-2">
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
