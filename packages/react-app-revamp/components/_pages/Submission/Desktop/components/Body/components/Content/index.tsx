import useEntryData from "@components/_pages/Submission/hooks/useEntryData";
import useContestConfigStore from "@hooks/useContestConfig/store";
import SubmissionPageDesktopBodyContentDescription from "./components/Description";
import SubmissionPageDesktopBodyContentInfo from "./components/Info";
import SubmissionPageDesktopBodyContentTitle from "./components/Title";

const SubmissionPageDesktopBodyContent = () => {
  const { contestConfig, proposalId } = useContestConfigStore(state => state);
  const { proposalData, isLoadingProposal, isErrorProposal } = useEntryData({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
    proposalId: proposalId,
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
