import { ProposalStaticData } from "@components/_pages/Submission/types";
import SubmissionPageDesktopBodyContentInfoContest from "./components/Contest";
import SubmissionPageDesktopBodyContentInfoCreator from "./components/Creator";
import { FC } from "react";
import SubmissionDelete from "@components/_pages/Submission/shared/components/SubmissionDelete";

interface SubmissionPageDesktopBodyContentInfoProps {
  proposalStaticData: ProposalStaticData;
}

const SubmissionPageDesktopBodyContentInfo: FC<SubmissionPageDesktopBodyContentInfoProps> = ({
  proposalStaticData,
}) => {
  return (
    <div className="pl-8 pr-4">
      <div className="flex gap-16 pt-4 pb-2">
        <SubmissionPageDesktopBodyContentInfoContest />
        <SubmissionPageDesktopBodyContentInfoCreator authorAddress={proposalStaticData.author} />
        <div className="ml-auto">
          <SubmissionDelete />
        </div>
      </div>
      <hr className="border-neutral-17" />
    </div>
  );
};

export default SubmissionPageDesktopBodyContentInfo;
