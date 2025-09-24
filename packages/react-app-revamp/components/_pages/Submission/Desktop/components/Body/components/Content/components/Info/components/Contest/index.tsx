import SubmissionPageDesktopBodyContentInfoContestName from "./components/Name";
import SubmissionPageDesktopBodyContentInfoContestAuthor from "./components/Author";

const SubmissionPageDesktopBodyContentInfoContest = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-neutral-9 text-[12px] font-bold uppercase">contest</p>
      <div className="flex flex-col gap-1">
        <SubmissionPageDesktopBodyContentInfoContestName />
        <SubmissionPageDesktopBodyContentInfoContestAuthor />
      </div>
    </div>
  );
};

export default SubmissionPageDesktopBodyContentInfoContest;
