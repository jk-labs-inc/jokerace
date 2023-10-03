import { pluralize } from "@helpers/pluralize";
import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ContestCountdownTimeUnit from "./components/TimeUnit";

const formatDuration = (duration: moment.Duration) => {
  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;
  return { days, hours, minutes, seconds };
};

const pluralizeLabel = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
};

const ContestCountdown = () => {
  const { submissionsOpen, votesOpen, votesClose } = useContestStore(state => state);
  const [duration, setDuration] = useState(formatDuration(moment.duration(0)));
  const [phase, setPhase] = useState("start");
  const memoizedSubmissionsOpen = useMemo(() => submissionsOpen, [submissionsOpen]);
  const memoizedVotesOpen = useMemo(() => votesOpen, [votesOpen]);
  const memoizedVotesClose = useMemo(() => votesClose, [votesClose]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

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

  const displayTime = () => {
    const elements = [];
    const dayLabel = isMobile ? "d " : pluralizeLabel(duration.days, " day ", " days ");
    const hourLabel = isMobile ? "h " : pluralizeLabel(duration.hours, " hr", " hrs ");
    const minuteLabel = isMobile ? "m " : pluralizeLabel(duration.minutes, " min ", " mins ");
    const secondLabel = isMobile ? "s " : pluralizeLabel(duration.seconds, " sec ", " secs ");

    if (duration.days > 0) elements.push(<ContestCountdownTimeUnit value={duration.days} label={dayLabel} />);
    if (duration.hours > 0) elements.push(<ContestCountdownTimeUnit value={duration.hours} label={hourLabel} />);
    if (duration.minutes > 0) elements.push(<ContestCountdownTimeUnit value={duration.minutes} label={minuteLabel} />);
    elements.push(<ContestCountdownTimeUnit value={duration.seconds} label={secondLabel} />);

    return elements;
  };

  const displayText = (phase: string) => {
    switch (phase) {
      case "start":
        return "Contest opens in";
      case "submit":
        return "Deadline to submit";
      case "vote":
        return "Deadline to vote";
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 border-r-primary-2 border-r-2 pr-3">
      <div className="flex gap-2">
        <Image src="/contest/timer.svg" width={16} height={16} alt="timer" />
        <p className="text-[12px] md:text-[16px] uppercase text-neutral-9">{displayText(phase)}</p>
      </div>
      <div className="flex items-center">
        <span className={`font-bold ${phase === "start" ? "text-neutral-9" : "text-neutral-11"} text-neutral-11`}>
          {displayTime()}
        </span>
      </div>
    </div>
  );
};

export default ContestCountdown;
