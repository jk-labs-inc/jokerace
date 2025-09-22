import { useContestStore } from "@hooks/useContest/store";
import useMetadataFields from "@hooks/useMetadataFields";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import { useShallow } from "zustand/shallow";

const SubmissionPageDesktopBodyContent = () => {
  return (
    <div className="pl-8 pr-4 h-[535px] bg-primary-13 rounded-4xl">
      <p>hey</p>
    </div>
  );
};

export default SubmissionPageDesktopBodyContent;
