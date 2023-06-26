import React, { useState, useEffect, FC } from "react";
import Image from "next/image";
import moment from "moment";
import { useWindowScroll } from "react-use";

const formatDuration = (duration: moment.Duration) => {
  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;
  return { days, hours, minutes, seconds };
};

interface LayoutContestCountdownProps {
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
}

const LayoutContestCountdown: FC<LayoutContestCountdownProps> = ({ submissionOpen, votingOpen, votingClose }) => {
  const [duration, setDuration] = useState(formatDuration(moment.duration(0)));
  const [phase, setPhase] = useState("submit");

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = moment();
      let diffTime;

      if (currentTime.isBefore(votingOpen)) {
        setPhase("submit");
        diffTime = moment(votingOpen).diff(currentTime);
      } else if (currentTime.isBefore(votingClose)) {
        setPhase("vote");
        diffTime = moment(votingClose).diff(currentTime);
      } else {
        clearInterval(interval);
        setDuration(formatDuration(moment.duration(0)));
        return;
      }
      setDuration(formatDuration(moment.duration(diffTime)));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [submissionOpen, votingOpen, votingClose]);

  const displayText = () => {
    if (duration.days > 0) {
      return `${duration.days} days ${duration.hours} hr ${duration.minutes} min ${duration.seconds} sec to ${phase}`;
    } else if (duration.hours > 0) {
      return `${duration.hours} hr ${duration.minutes} min ${duration.seconds} sec to ${phase}`;
    } else if (duration.minutes > 0) {
      return `${duration.minutes} min ${duration.seconds} sec to ${phase}`;
    } else {
      return `${duration.seconds} sec to ${phase}`;
    }
  };

  return (
    <div className="w-full bg-true-black flex flex-col gap-1 border border-neutral-11 rounded-[10px] py-2 items-center shadow-timer-container">
      <Image src="/contest/timer.svg" width={33} height={33} alt="timer" />
      <div className="flex flex-col">
        <div className="text-[16px] font-bold text-neutral-11">{displayText()}</div>
        {phase === "submit" && (
          <div className="text-[16px] text-neutral-11 ">
            Voting follows until {moment(votingClose).format("MMMM Do, h:mm a")}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutContestCountdown;
