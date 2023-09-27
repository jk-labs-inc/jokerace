import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const formatDuration = (duration: moment.Duration) => {
  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;
  return { days, hours, minutes, seconds };
};

const ContestCountdown = () => {
  const { submissionsOpen, votesOpen, votesClose } = useContestStore(state => state);
  const [duration, setDuration] = useState(formatDuration(moment.duration(0)));
  const [phase, setPhase] = useState("start");
  const memoizedSubmissionsOpen = useMemo(() => submissionsOpen, [submissionsOpen]);
  const memoizedVotesOpen = useMemo(() => votesOpen, [votesOpen]);
  const memoizedVotesClose = useMemo(() => votesClose, [votesClose]);

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
    if (duration.days > 0) {
      return `${duration.days} days ${duration.hours} hr ${duration.minutes} min ${duration.seconds} sec `;
    } else if (duration.hours > 0) {
      return `${duration.hours} hr ${duration.minutes} min ${duration.seconds} sec `;
    } else if (duration.minutes > 0) {
      return `${duration.minutes} min ${duration.seconds} sec `;
    } else {
      return `${duration.seconds} sec `;
    }
  };

  return (
    <div className={`w-full h-12 bg-neutral-0 flex gap-3 border border-transparent rounded-[10px] p-4 items-center`}>
      <Image src="/contest/timer.svg" width={24} height={24} alt="timer" />
      <div className="flex items-center">
        <div className="text-[16px]">
          <span className="font-bold text-neutral-11">{displayText()}</span>
          {phase === "start" ? (
            <span className="text-neutral-11"> until contest opens</span>
          ) : phase === "submit" ? (
            <span className="text-neutral-11"> to submit</span>
          ) : (
            <span className="text-neutral-11"> to vote</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCountdown;
