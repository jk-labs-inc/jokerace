import SubmissionPageMobileBodyContentInfo from "./components/Info";
import SubmissionPageMobileBodyContentProposal from "./components/Proposal";
import SubmissionPageMobileBodyContentVoters from "./components/Voters";

const SubmissionPageMobileBodyContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <SubmissionPageMobileBodyContentInfo />
      <SubmissionPageMobileBodyContentProposal />
      <SubmissionPageMobileBodyContentVoters />
    </div>
  );
};

export default SubmissionPageMobileBodyContent;
