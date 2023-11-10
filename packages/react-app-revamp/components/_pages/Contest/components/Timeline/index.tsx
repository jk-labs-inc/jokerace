import React, { useState, useEffect, FC } from "react";
import moment from "moment";
import { useContestStore } from "@hooks/useContest/store";

interface Stage {
  name: string;
  action: string;
  date: Date;
}

const ContestTimeline = () => {
  const { submissionsOpen, votesClose, votesOpen } = useContestStore(state => state);

  const stages: Stage[] = [
    { name: "Submission Open", action: "Submissions are open", date: submissionsOpen },
    { name: "Voting Opens", action: "Voting is open", date: votesOpen },
    { name: "Contest Closes", action: "Contest closed", date: votesClose },
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(-1);

  useEffect(() => {
    const calculateCurrentStageIndex = () => {
      const now = moment();
      let activeStageIndex = -1;
      for (let i = stages.length - 1; i >= 0; i--) {
        if (now.isSameOrAfter(moment(stages[i].date))) {
          activeStageIndex = i;
          break;
        }
      }
      return activeStageIndex;
    };

    setCurrentStageIndex(calculateCurrentStageIndex());

    const interval = setInterval(() => {
      setCurrentStageIndex(calculateCurrentStageIndex());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionsOpen, votesOpen, votesClose]);

  return (
    <div className="hidden lg:grid grid-cols-3 lg:gap-0">
      {stages.map((stage, index) => (
        <div key={index} className={`opacity-${currentStageIndex === index ? "100" : "50"} text-neutral-11`}>
          <div className="text-[16px] font-bold mb-1">
            {index === currentStageIndex
              ? "Now"
              : currentStageIndex > index && currentStageIndex !== stages.length - 1
              ? "Previous"
              : moment(stage.date).format("MMMM D, h:mm a")}
          </div>
          <div className="h-[1px] bg-neutral-11"></div>
          <div className="text-[16px] font-bold mt-1">
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

export default ContestTimeline;
