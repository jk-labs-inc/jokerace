import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { useShallow } from "zustand/shallow";

const SubmissionPageDesktopBodyContentInfoContestAuthor = () => {
  const contestAuthor = useSubmissionPageStore(useShallow(state => state.contestDetails.author));

  return (
    <UserProfileDisplay
      ethereumAddress={contestAuthor as string}
      shortenOnFallback
      textualVersion
      size="extraSmall"
      textColor="text-positive-11"
    />
  );
};

export default SubmissionPageDesktopBodyContentInfoContestAuthor;
