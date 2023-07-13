import React, { useState, useEffect, FC, useMemo } from "react";
import Image from "next/image";
import moment from "moment";
import { useWindowScroll } from "react-use";
import { useContestStore } from "@hooks/useContest/store";

const formatDuration = (duration: moment.Duration) => {
  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;
  return { days, hours, minutes, seconds };
};

const LayoutContestCountdown = () => {
  const { submissionsOpen, votesOpen, votesClose } = useContestStore(state => state);
  const [duration, setDuration] = useState(formatDuration(moment.duration(0)));
  const [phase, setPhase] = useState("contest");
  const { y } = useWindowScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const memoizedSubmissionsOpen = useMemo(() => submissionsOpen, [submissionsOpen.getTime()]);
  const memoizedVotesOpen = useMemo(() => votesOpen, [votesOpen.getTime()]);
  const memoizedVotesClose = useMemo(() => votesClose, [votesClose.getTime()]);

  useEffect(() => {
    setIsScrolled(y > 500);
  }, [y]);

  useEffect(() => {
    const calculateDuration = () => {
      const currentTime = moment();
      let diffTime;

      if (currentTime.isBefore(memoizedSubmissionsOpen)) {
        setPhase("start");
        diffTime = moment(memoizedSubmissionsOpen).diff(currentTime);
      } else if (currentTime.isBefore(memoizedVotesOpen)) {
        setPhase("submit");
        diffTime = moment(memoizedVotesOpen).diff(currentTime);
      } else if (currentTime.isBefore(memoizedVotesClose)) {
        setPhase("vote");
        diffTime = moment(memoizedVotesClose).diff(currentTime);
      } else {
        setDuration(formatDuration(moment.duration(0)));
        return;
      }
      setDuration(formatDuration(moment.duration(diffTime)));
    };

    calculateDuration();

    const interval = setInterval(calculateDuration, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [memoizedSubmissionsOpen, memoizedVotesOpen, memoizedVotesClose]);

  const displayText = () => {
    if (isScrolled) {
      if (duration.days > 0) {
        return `${duration.days}d ${duration.hours}h ${duration.minutes}m ${duration.seconds}s to ${phase}`;
      } else if (duration.hours > 0) {
        return `${duration.hours}h ${duration.minutes}m ${duration.seconds}s to ${phase}`;
      } else if (duration.minutes > 0) {
        return `${duration.minutes}m ${duration.seconds}s to ${phase}`;
      } else {
        return `${duration.seconds}s to ${phase}`;
      }
    } else {
      if (duration.days > 0) {
        return `${duration.days} days ${duration.hours} hr ${duration.minutes} min ${duration.seconds} sec to ${phase}`;
      } else if (duration.hours > 0) {
        return `${duration.hours} hr ${duration.minutes} min ${duration.seconds} sec to ${phase}`;
      } else if (duration.minutes > 0) {
        return `${duration.minutes} min ${duration.seconds} sec to ${phase}`;
      } else {
        return `${duration.seconds} sec to ${phase}`;
      }
    }
  };

  return (
    <div
      className={`w-full bg-true-black flex flex-col ${
        isScrolled ? "justify-between" : ""
      } gap-1 border border-neutral-11 rounded-[10px] py-2 items-center shadow-timer-container`}
    >
      <Image src="/contest/timer.svg" width={33} height={33} alt="timer" />
      <div className="flex flex-col items-center">
        {isScrolled ? (
          <div className="text-[20px] font-bold text-neutral-11">{displayText()}</div>
        ) : (
          <>
            <div className="text-[16px] font-bold text-neutral-11">{displayText()}</div>
            {phase === "start" ? (
              <div className="text-[16px] text-neutral-11">
                Submissions follow until {moment(votesOpen).format("MMMM Do, h:mm a")}
              </div>
            ) : phase === "vote" ? (
              <div className="text-[16px] text-neutral-11">
                Voting is open until {moment(votesClose).format("MMMM Do, h:mm a")}
              </div>
            ) : (
              <div className="text-[16px] text-neutral-11">
                Voting follows until {moment(votesClose).format("MMMM Do, h:mm a")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LayoutContestCountdown;
