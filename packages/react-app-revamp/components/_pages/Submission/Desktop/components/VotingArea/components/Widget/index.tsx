import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import useCharge from "@hooks/useCharge";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopVotingAreaWidgetHandler from "./components/Handler";
import SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton from "./components/LoadingSkeleton";

const SubmissionPageDesktopVotingAreaWidget = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const voteTimings = useSubmissionPageStore(state => state.voteTimings);
  const {
    charge,
    isLoading: isChargeLoading,
    isError: isChargeError,
  } = useCharge({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  const votesClose = new Date(Number(voteTimings?.contestDeadline) * 1000 + 1000);

  if (isChargeError) {
    return (
      <div className="text-[16px] pl-8 pr-12 py-4 text-negative-11 font-bold">
        ruh-roh! we were unable to fetch vote details, please reload the page.
      </div>
    );
  }

  if (isChargeLoading) {
    return <SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton />;
  }

  return <SubmissionPageDesktopVotingAreaWidgetHandler charge={charge} votesClose={votesClose} />;
};

export default SubmissionPageDesktopVotingAreaWidget;
