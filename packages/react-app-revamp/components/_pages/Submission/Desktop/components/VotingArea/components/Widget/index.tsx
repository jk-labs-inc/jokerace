import useContestVoteDeadline from "@components/_pages/Submission/hooks/useContestVoteDeadline";
import useCharge from "@hooks/useCharge";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopVotingAreaWidgetHandler from "./components/Handler";
import SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton from "./components/LoadingSkeleton";

const SubmissionPageDesktopVotingAreaWidget = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const {
    contestDeadline,
    isLoading: isContestVoteDeadlineLoading,
    isError: isContestVoteDeadlineError,
  } = useContestVoteDeadline({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });
  const votesClose = new Date(Number(contestDeadline as string) * 1000 + 1000);
  const {
    charge,
    isLoading: isChargeLoading,
    isError: isChargeError,
  } = useCharge({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  if (isChargeError || isContestVoteDeadlineError) {
    return <div>Error loading charge</div>;
  }

  if (isChargeLoading || isContestVoteDeadlineLoading) {
    return <SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton />;
  }

  return <SubmissionPageDesktopVotingAreaWidgetHandler charge={charge} votesClose={votesClose} />;
};

export default SubmissionPageDesktopVotingAreaWidget;
