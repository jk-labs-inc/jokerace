import Comments from "@components/Comments";
import GradientText from "@components/UI/GradientText";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import useNumberOfComments from "./hooks/useNumberOfComments";

const SubmissionPageDesktopBodyComments = () => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const { contestAuthor, contestState } = useSubmissionPageStore(
    useShallow(state => ({
      contestAuthor: state.proposalStaticData?.author,
      contestState: state.contestDetails.state,
    })),
  );
  const { numberOfComments } = useNumberOfComments({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
    proposalId: proposalId,
  });

  return (
    <div className="w-full flex flex-col gap-3 pl-8 pt-4 pb-4 bg-gradient-comments-area-purple rounded-4xl">
      <div className="flex items-baseline gap-2 flex-shrink-0">
        <Image src="/entry/comment.svg" alt="comments" width={24} height={24} className="self-center mt-1" />
        <GradientText isFontSabo={false} textSizeClassName="text-[24px] font-bold">
          comments
        </GradientText>
        <p className="text-[16px] text-neutral-11 font-bold">
          {numberOfComments !== undefined && `(${numberOfComments})`}
        </p>
      </div>
      <Comments
        contestAddress={contestConfig.address}
        contestChainId={contestConfig.chainId}
        proposalId={proposalId}
        numberOfComments={numberOfComments ?? null}
        contestAuthor={contestAuthor ?? ""}
        contestState={contestState}
      />
    </div>
  );
};

export default SubmissionPageDesktopBodyComments;
