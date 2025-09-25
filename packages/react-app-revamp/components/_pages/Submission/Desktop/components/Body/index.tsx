import SubmissionPageDesktopBodyContent from "./components/Content";

const SubmissionPageDesktopBody = () => {
  return (
    <div className="flex flex-col gap-4 bg-primary-1 rounded-4xl">
      <div className="p-4 flex-1">
        <SubmissionPageDesktopBodyContent />
      </div>
      {/* TODO: add comments */}
    </div>
  );
};

export default SubmissionPageDesktopBody;
