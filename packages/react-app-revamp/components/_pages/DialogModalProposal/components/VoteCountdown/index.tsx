import ContestCountdownTimeUnit from "@components/_pages/Contest/components/StickyCards/components/Countdown/components/TimeUnit";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

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

interface DialogModalProposalVoteCountdownProps {
  votesOpen: Date;
}

const DialogModalProposalVoteCountdown: FC<DialogModalProposalVoteCountdownProps> = ({ votesOpen }) => {
  const [duration, setDuration] = useState(formatDuration(moment.duration(0)));
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const calculateDuration = () => {
      const currentTime = moment();
      if (currentTime.isBefore(votesOpen)) {
        const diffTime = moment(votesOpen).diff(currentTime);
        setDuration(formatDuration(moment.duration(diffTime)));
      } else {
        setDuration(formatDuration(moment.duration(0)));
      }
    };

    calculateDuration();
    const interval = setInterval(calculateDuration, 1000);
    return () => clearInterval(interval);
  }, [votesOpen]);

  const displayTime = () => {
    const elements = [];
    const dayLabel = isMobile ? "d " : pluralizeLabel(duration.days, " day ", " days ");
    const hourLabel = isMobile ? "h " : pluralizeLabel(duration.hours, " hr ", " hrs ");
    const minuteLabel = isMobile ? "m " : pluralizeLabel(duration.minutes, " min ", " mins ");
    const secondLabel = isMobile ? "s " : pluralizeLabel(duration.seconds, " sec ", " secs ");

    if (duration.days > 0)
      elements.push(<ContestCountdownTimeUnit key={`${duration.days}-days`} value={duration.days} label={dayLabel} />);
    if (duration.hours > 0)
      elements.push(
        <ContestCountdownTimeUnit key={`${duration.hours}-hours`} value={duration.hours} label={hourLabel} />,
      );
    if (duration.minutes > 0)
      elements.push(
        <ContestCountdownTimeUnit key={`${duration.minutes}-minutes`} value={duration.minutes} label={minuteLabel} />,
      );
    elements.push(
      <ContestCountdownTimeUnit key={`${duration.seconds}-seconds`} value={duration.seconds} label={secondLabel} />,
    );

    return elements;
  };

  return (
    <div className="border-b border-neutral-2 p-4">
      <div className="flex gap-2 mb-2">
        <img src="/contest/timer.svg" width={16} height={16} alt="timer" />
        <p className="text-[12px] md:text-[16px] uppercase text-neutral-9">voting opens in</p>
      </div>
      <div className="flex items-center">
        <span className="font-bold text-neutral-11">{displayTime()}</span>
      </div>
    </div>
  );
};

export default DialogModalProposalVoteCountdown;
