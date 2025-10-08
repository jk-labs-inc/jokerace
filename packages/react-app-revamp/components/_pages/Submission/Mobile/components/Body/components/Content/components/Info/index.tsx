import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import SubmissionDelete from "@components/_pages/Submission/shared/components/SubmissionDelete";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { useShallow } from "zustand/shallow";
import SubmissionPageMobileBodyContentInfoVotes from "./components/Votes";

const SubmissionPageMobileBodyContentInfo = () => {
  const proposalStaticData = useSubmissionPageStore(useShallow(state => state.proposalStaticData));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <UserProfileDisplay
          ethereumAddress={proposalStaticData?.author ?? ""}
          shortenOnFallback={true}
          textColor="text-neutral-9"
        />
        <SubmissionDelete />
      </div>
      <SubmissionPageMobileBodyContentInfoVotes />
    </div>
  );
};

export default SubmissionPageMobileBodyContentInfo;
