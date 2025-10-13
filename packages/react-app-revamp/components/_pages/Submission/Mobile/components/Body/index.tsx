import SubmissionPageMobileBodyComments from "./components/Comments";
import SubmissionPageMobileBodyContent from "./components/Content";

const SubmissionPageMobileBody = () => {
  return (
    <div className="animate-reveal flex flex-col gap-6">
      <SubmissionPageMobileBodyContent />
      <SubmissionPageMobileBodyComments />
    </div>
  );
};

export default SubmissionPageMobileBody;
