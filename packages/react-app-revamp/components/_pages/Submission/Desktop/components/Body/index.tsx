import SubmissionPageDesktopBodyContent from "./components/Content";

const SubmissionPageDesktopBody = () => {
  return (
    <div className="flex flex-col gap-4 h-[760px] bg-primary-1 rounded-4xl">
      <div className="p-4">
        <SubmissionPageDesktopBodyContent />
      </div>
    </div>
  );
};

export default SubmissionPageDesktopBody;
