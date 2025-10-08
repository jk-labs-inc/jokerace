import SubmissionPageDesktopBodyComments from "./components/Comments";
import SubmissionPageDesktopBodyContent from "./components/Content";

const SubmissionPageDesktopBody = () => {
  return (
    <div className="flex flex-col bg-primary-1 rounded-4xl">
      <div className="p-4 flex-1">
        <SubmissionPageDesktopBodyContent />
      </div>
      <div className="pl-4 pr-4 pb-4">
        <SubmissionPageDesktopBodyComments />
      </div>
    </div>
  );
};

export default SubmissionPageDesktopBody;
