import useNumberOfComments from "@components/_pages/Submission/Desktop/components/Body/components/Comments/hooks/useNumberOfComments";
import SubmissionPageMobileComments from "@components/_pages/Submission/Mobile/components/Comments";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";

const SubmissionPageMobileBodyComments = () => {
  const { contestConfig, proposalId } = useContestConfigStore(useShallow(state => state));
  const { numberOfComments, isLoading, isError } = useNumberOfComments({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
    proposalId: proposalId,
  });

  // TODO: add loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <p className="text-[20px] text-neutral-11 font-bold">comments</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[16px] text-negative-11 font-bold">
          an error occurred when retrieving comments for this proposal; try refreshing the page.
        </p>
      </div>
    );
  }

  return <SubmissionPageMobileComments numberOfComments={numberOfComments ?? null} />;
};

export default SubmissionPageMobileBodyComments;
