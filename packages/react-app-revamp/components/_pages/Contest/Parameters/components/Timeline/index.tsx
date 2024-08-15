import ContestTimeline from "@components/_pages/Contest/components/Timeline";
import { FC } from "react";

interface ContestParametersTimelineProps {
  submissionsOpen: string;
  votesOpen: string;
  votesClose: string;
}

const ContestParametersTimeline: FC<ContestParametersTimelineProps> = ({ submissionsOpen, votesOpen, votesClose }) => {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-[20px] font-bold text-neutral-14">timeline</p>
      <ContestTimeline />
      <div className="flex flex-col lg:hidden gap-4">
        <div className="flex justify-between items-end text-[16px] font-bold border-b border-neutral-10 pb-3">
          <p>submissions open:</p>
          <p>{submissionsOpen}</p>
        </div>
        <div className="flex justify-between items-end text-[16px] font-bold  border-b border-neutral-10 pb-3">
          <p>
            submissions close/
            <br />
            voting opens:
          </p>
          <p>{votesOpen}</p>
        </div>
        <div className="flex justify-between items-end text-[16px] font-bold  border-b border-neutral-10 pb-3">
          <p>voting closes:</p>
          <p>{votesClose}</p>
        </div>
      </div>
    </div>
  );
};

export default ContestParametersTimeline;
