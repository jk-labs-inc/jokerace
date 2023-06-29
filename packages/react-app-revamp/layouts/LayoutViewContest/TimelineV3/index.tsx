import React, { useState, useEffect, FC } from "react";
import moment from "moment";

interface Stage {
  name: string;
  action: string;
  date: Date;
  color: string;
}

interface LayoutContestTimelineProps {
  submissionOpenDate: Date;
  votingOpensDate: Date;
  contestCloseDate: Date;
}

const LayoutContestTimeline: FC<LayoutContestTimelineProps> = ({
  submissionOpenDate,
  votingOpensDate,
  contestCloseDate,
}) => {
  const stages: Stage[] = [
    { name: "Submission Open", action: "Submissions are open", date: submissionOpenDate, color: "primary-10" },
    { name: "Voting Opens", action: "Voting is open", date: votingOpensDate, color: "positive-11" },
    { name: "Contest Closes", action: "Contest closed", date: contestCloseDate, color: "neutral-11" },
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      let activeStageIndex = -1;
      for (let i = stages.length - 1; i >= 0; i--) {
        if (now.isSameOrAfter(moment(stages[i].date))) {
          activeStageIndex = i;
          break;
        }
      }
      setCurrentStageIndex(activeStageIndex);
    }, 1000);
    return () => clearInterval(interval);
  }, [submissionOpenDate, votingOpensDate, contestCloseDate]);

  return (
    <div className="hidden lg:grid grid-cols-3 lg:gap-0">
      {stages.map((stage, index) => (
        <div key={index} style={{ opacity: currentStageIndex === index ? 1 : 0.5 }}>
          <div className="text-[16px] font-bold mb-1">
            {index === currentStageIndex
              ? "Now"
              : currentStageIndex > index && currentStageIndex !== stages.length - 1
              ? "Previous"
              : moment(stage.date).format("MMMM D, h:mm a")}
          </div>
          <div className={`h-[1px] bg-${stage.color}`}></div>
          <div className={`text-[16px] font-bold mt-1 text-${stage.color}`}>
            {index === currentStageIndex
              ? stage.action
              : currentStageIndex === stages.length - 1 && index < currentStageIndex
              ? index === 0
                ? "Submissions period"
                : "Voting period"
              : stage.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayoutContestTimeline;
