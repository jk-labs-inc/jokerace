import { useEntryContractConfigStore } from "@components/_pages/Submission/hooks/useEntryContractConfig/store";
import SubmissionPageDesktopBodyContentTitle from "./components/Title";
import useEntryData from "@components/_pages/Submission/hooks/useEntryData";
import SubmissionPageDesktopBodyContentInfo from "./components/Info";
import SubmissionPageDesktopBodyContentDescription from "./components/Description";

const SubmissionPageDesktopBodyContent = () => {
  const { contestAddress, contestChainId, contestAbi, proposalId } = useEntryContractConfigStore(state => state);
  const { proposalData, isLoadingProposal, isErrorProposal } = useEntryData({
    contestAddress,
    contestChainId,
    contestAbi,
    proposalId,
  });

  //TODO: add loading and error states
  if (isLoadingProposal || isErrorProposal) {
    return null;
  }

  if (!proposalData) {
    return null;
  }

  return (
    <div className="bg-primary-13 rounded-4xl flex flex-col">
      <SubmissionPageDesktopBodyContentTitle stringArray={proposalData.fieldsMetadata.stringArray} />
      <SubmissionPageDesktopBodyContentInfo proposalData={proposalData} />
      <SubmissionPageDesktopBodyContentDescription description={proposalData.description} />
    </div>
  );
};

export default SubmissionPageDesktopBodyContent;
