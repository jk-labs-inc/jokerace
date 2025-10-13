import SubmissionPageDesktopBodyComments from "./components/Comments";
import SubmissionPageDesktopBodyContent from "./components/Content";

const SubmissionPageDesktopBody = () => {
  return (
    <div className="flex flex-col bg-primary-1 rounded-4xl h-full">
      <div className="p-4 flex-1">
        <SubmissionPageDesktopBodyContent />
      </div>
      <SubmissionPageDesktopBodyComments />
    </div>
  );
};

export default SubmissionPageDesktopBody;
