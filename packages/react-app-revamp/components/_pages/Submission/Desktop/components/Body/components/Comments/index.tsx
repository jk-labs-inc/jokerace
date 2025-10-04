import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";
import useNumberOfComments from "./hooks/useNumberOfComments";
import GradientText from "@components/UI/GradientText";
import Image from "next/image";
import SubmissionPageDesktopBodyCommentsLoadingSkeleton from "./components/LoadingSkeleton";

const SubmissionPageDesktopBodyComments = () => {
  const { contestConfig, proposalId } = useContestConfigStore(useShallow(state => state));
  const { numberOfComments, isLoading, isError } = useNumberOfComments({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
    proposalId: proposalId,
  });

  if (isLoading) {
    return <SubmissionPageDesktopBodyCommentsLoadingSkeleton />;
  }

  return (
    <div className="w-full pl-8 pt-4 pb-4 h-44 bg-gradient-comments-area-purple rounded-4xl">
      <div className="flex items-baseline gap-2 flex-shrink-0">
        <Image src="/entry/comment.svg" alt="comments" width={24} height={24} className="self-center mt-1" />
        <GradientText isFontSabo={false} textSizeClassName="text-[24px] font-bold">
          comments
        </GradientText>
        <p className="text-[16px] text-neutral-11 font-bold">
          {numberOfComments !== undefined && numberOfComments > 0 ? `(${numberOfComments})` : ""}
        </p>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopBodyComments;
