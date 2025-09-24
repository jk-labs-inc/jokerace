import { ProposalCore } from "@hooks/useProposal/store";
import SubmissionPageDesktopBodyContentInfoContest from "./components/Contest";
import SubmissionPageDesktopBodyContentInfoCreator from "./components/Creator";
import { FC } from "react";

interface SubmissionPageDesktopBodyContentInfoProps {
  proposalData: ProposalCore;
}

const SubmissionPageDesktopBodyContentInfo: FC<SubmissionPageDesktopBodyContentInfoProps> = ({ proposalData }) => {
  return (
    <div className="pl-8 pr-4">
      <div className="flex gap-16 pt-4 pb-2">
        <SubmissionPageDesktopBodyContentInfoContest />
        <SubmissionPageDesktopBodyContentInfoCreator authorAddress={proposalData.author} />
      </div>
      <hr className="border-neutral-17" />
    </div>
  );
};

export default SubmissionPageDesktopBodyContentInfo;
