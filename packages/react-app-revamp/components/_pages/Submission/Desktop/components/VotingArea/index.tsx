import useContestVoteTimer from "@components/_pages/Submission/hooks/useContestVoteTimer";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopVotingAreaTimer from "./components/Timer";
import SubmissionPageDesktopVotingAreaWidget from "./components/Widget";
import ListProposalVotes from "@components/_pages/ListProposalVotes";

const SubmissionPageDesktopVotingArea = () => {
  const { contestConfig, proposalId } = useContestConfigStore(useShallow(state => state));
  const { isVotingOpen, isLoading, isError } = useContestVoteTimer({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 items-start">
      <SubmissionPageDesktopVotingAreaTimer />
      <div className="bg-primary-1 rounded-4xl">
        <div className="p-4">{isVotingOpen && <SubmissionPageDesktopVotingAreaWidget />}</div>
        <div className="p-4">
          <ListProposalVotes proposalId={proposalId} votedAddresses={[]} className="text-neutral-9" />
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopVotingArea;
