import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopBodyContentDescription from "./components/Description";
import SubmissionPageDesktopBodyContentInfo from "./components/Info";
import SubmissionPageDesktopBodyContentTitle from "./components/Title";

const SubmissionPageDesktopBodyContent = () => {
  const proposalStaticData = useSubmissionPageStore(useShallow(state => state.proposalStaticData));

  if (!proposalStaticData) {
    return null;
  }

  return (
    <div className="bg-primary-13 rounded-4xl flex flex-col h-full">
      <SubmissionPageDesktopBodyContentTitle stringArray={proposalStaticData.fieldsMetadata.stringArray} />
      <SubmissionPageDesktopBodyContentInfo proposalStaticData={proposalStaticData} />
      <SubmissionPageDesktopBodyContentDescription description={proposalStaticData.description} />
    </div>
  );
};

export default SubmissionPageDesktopBodyContent;
