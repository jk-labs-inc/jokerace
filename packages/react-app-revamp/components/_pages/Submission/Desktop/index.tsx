import SubmissionPageDesktopBody from "./components/Body";
import SubmissionPageDesktopHeader from "./components/Header";

const SubmissionPageDesktopLayout = () => {
  return (
    <div className="px-20 mt-8">
      <div className="flex gap-4">
        <div className="flex flex-col gap-8 w-[60%]">
          <SubmissionPageDesktopHeader />
          <SubmissionPageDesktopBody />
        </div>
        <div className="w-[40%]">
          {/* Right content - 40% width */}
          <p>Right side content (40%)</p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopLayout;
