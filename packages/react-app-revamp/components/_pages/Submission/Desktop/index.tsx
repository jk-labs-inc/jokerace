import SubmissionPageDesktopBody from "./components/Body";
import SubmissionPageDesktopHeader from "./components/Header";

interface SubmissionPageDesktopLayoutProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
  };
  proposalId: string;
}

const SubmissionPageDesktopLayout = ({ contestInfo, proposalId }: SubmissionPageDesktopLayoutProps) => {
  return (
    <div className="px-20 mt-8">
      <div className="flex gap-4">
        <div className="flex flex-col gap-8 w-[60%]">
          <SubmissionPageDesktopHeader contestInfo={contestInfo} proposalId={proposalId} />
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
