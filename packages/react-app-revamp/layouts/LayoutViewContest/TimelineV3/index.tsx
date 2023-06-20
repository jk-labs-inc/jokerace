import React, { useState, useEffect, FC } from "react";
import moment from "moment";

const stages = ["Submission Open", "Voting Opens", "Contest Closes"];

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
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      if (now.isSameOrAfter(moment(contestCloseDate))) setCurrentStage(2);
      else if (now.isSameOrAfter(moment(votingOpensDate))) setCurrentStage(1);
      else setCurrentStage(0);
    }, 1000);
    return () => clearInterval(interval);
  }, [submissionOpenDate, votingOpensDate, contestCloseDate]);

  const getLabel = (index: number) => {
    if (currentStage === index) return "Now";
    if (currentStage > index && currentStage !== stages.length - 1) return "Previous";
    if (index === 0) return moment(submissionOpenDate).format("MMMM D, h:mm a");
    if (index === 1) return moment(votingOpensDate).format("MMMM D, h:mm a");
    if (index === 2) return moment(contestCloseDate).format("MMMM D, h:mm a");
  };

  const getStageLabel = (index: number) => {
    if (currentStage === stages.length - 1) {
      switch (index) {
        case 0:
          return "Submission period";
        case 1:
          return "Voting period";
        case 2:
          return "Contest closed";
      }
    } else {
      return stages[index];
    }
  };

  const getOpacity = (index: number) => (currentStage === index ? 1 : 0.5);
  const getColor = (index: number) => (index === 0 ? "primary-10" : index === 1 ? "positive-11" : "neutral-11");

  return (
    <div className="hidden lg:grid grid-cols-3 lg:gap-0">
      {stages.map((stage, index) => (
        <div key={index} style={{ opacity: getOpacity(index) }}>
          <div className="text-[16px] font-bold  mb-1">{getLabel(index)}</div>
          <div className={`h-[1px] bg-${getColor(index)}`}></div>
          <div className={`text-[16px] font-bold mt-1 text-${getColor(index)}`}>{getStageLabel(index)}</div>
        </div>
      ))}
    </div>
  );
};

export default LayoutContestTimeline;
