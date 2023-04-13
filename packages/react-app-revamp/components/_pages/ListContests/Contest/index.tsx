import CircularProgressBar from "@components/Clock";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { chains, chainsImages } from "@config/wagmi";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import useContestInfo from "@hooks/useContestInfo";
import { getAccount } from "@wagmi/core";
import moment from "moment";
import router from "next/router";
import { FC, useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface ContestProps {
  contest: any;
  compact: boolean;
  loading: boolean;
}

type TimeLeft = {
  value: number;
  type: "days" | "hours" | "minutes";
};

const Contest: FC<ContestProps> = ({ contest, compact, loading }) => {
  const { address } = getAccount();
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const [submissionTimeLeft, setSubmissionTimeLeft] = useState<TimeLeft>({
    value: 0,
    type: "minutes",
  });
  const [votingTimeLeft, setVotingTimeLeft] = useState<TimeLeft>({
    value: 0,
    type: "minutes",
  });
  const [onCountdownComplete, setOnCountdownComplete] = useState(false);
  const { submissionClass, votingClass, submissionMessage, votingMessage } = useContestInfo({
    loading,
    submissionStatus,
    votingStatus,
    contest,
    address,
    chains,
  });

  const [timerValues, setTimerValues] = useState({
    submissionHours: 0,
    submissionMinutes: 0,
    submissionSeconds: 0,
    votingHours: 0,
    votingMinutes: 0,
    votingSeconds: 0,
  });

  const handleClick = (contest: any) => {
    const query = {
      chain: contest.network_name,
      address: contest.address,
    };

    router.push({
      pathname: ROUTE_VIEW_CONTEST,
      query: query,
    });
  };

  useEffect(() => {
    const now = moment();

    if (now.isBefore(moment(contest.start_at))) {
      setSubmissionStatus("Submissions open in:");
    } else if (now.isBefore(moment(contest.vote_start_at))) {
      setSubmissionStatus("Submissions are open");

      const secondsLeft = moment(contest.vote_start_at).diff(now, "seconds");
      const minutesLeft = moment(contest.vote_start_at).diff(now, "minutes");
      const hoursLeft = Math.floor(minutesLeft / 60);
      const daysLeft = Math.floor(hoursLeft / 24);

      setTimerValues({
        ...timerValues,
        submissionSeconds: secondsLeft % 60,
        submissionMinutes: minutesLeft % 60,
        submissionHours: hoursLeft % 24,
      });

      if (minutesLeft < 60) {
        setSubmissionTimeLeft({ value: minutesLeft, type: "minutes" });
      } else if (hoursLeft < 24) {
        setSubmissionTimeLeft({ value: hoursLeft, type: "hours" });
      } else {
        setSubmissionTimeLeft({ value: daysLeft, type: "days" });
      }
    } else {
      setSubmissionStatus("Submissions closed");
    }

    if (now.isBefore(moment(contest.vote_start_at))) {
      setVotingStatus("Voting opens in:");
    } else if (now.isBefore(moment(contest.end_at))) {
      setVotingStatus("Voting is open");

      const secondsLeft = moment(contest.end_at).diff(now, "seconds");
      const minutesLeft = moment(contest.end_at).diff(now, "minutes");
      const hoursLeft = Math.floor(minutesLeft / 60);
      const daysLeft = Math.floor(hoursLeft / 24);

      setTimerValues({
        ...timerValues,
        votingSeconds: secondsLeft % 60,
        votingMinutes: minutesLeft % 60,
        votingHours: hoursLeft % 24,
      });

      if (minutesLeft < 60) {
        setVotingTimeLeft({ value: minutesLeft, type: "minutes" });
      } else if (hoursLeft < 24) {
        setVotingTimeLeft({ value: hoursLeft, type: "hours" });
      } else {
        setVotingTimeLeft({ value: daysLeft, type: "days" });
      }
    } else {
      setVotingStatus("Voting closed");
    }

    setOnCountdownComplete(false);
  }, [contest, onCountdownComplete]);

  const renderer = ({ days, hours, minutes, seconds }: CountdownRenderProps, targetDate: moment.Moment) => {
    if (days > 5) {
      return <span>{targetDate.format("MMMM Do")}</span>;
    } else if (days > 0) {
      return <span>{days} days</span>;
    } else if (hours > 0) {
      return <span>{hours} hours</span>;
    } else if (minutes > 0) {
      return <span>{minutes} minutes</span>;
    } else {
      return <span>{seconds} seconds</span>;
    }
  };

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={2}>
      <div
        className="full-width-grid-cols border-t border-neutral-9 py-6 items-center p-3 hover:bg-neutral-0 transition-colors duration-300 ease-in-out cursor-pointer"
        key={`live-contest-${contest.id}`}
        onClick={() => handleClick(contest)}
      >
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton circle height={32} width={32} />
          ) : (
            <img className="w-8 h-auto" src={chainsImages[contest.network_name]} alt="" />
          )}
          <p className="font-bold">{loading ? <Skeleton width={200} /> : contest.title}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-start ${submissionClass} justify-between gap-3`}>
            <div className="min-w-[185px]">
              <p className="font-bold">
                {loading ? (
                  <Skeleton width={150} />
                ) : (
                  <>
                    {submissionStatus}{" "}
                    {submissionStatus.includes("in:") && (
                      <Countdown
                        date={moment(contest.start_at).toDate()}
                        renderer={props => renderer(props, moment(contest.start_at))}
                        onComplete={() => setOnCountdownComplete(true)}
                      />
                    )}
                  </>
                )}
              </p>
              {loading ? <Skeleton width={185} /> : submissionMessage}
            </div>
            {loading ? (
              <Skeleton circle height={50} width={50} />
            ) : submissionTimeLeft.value ? (
              <div className="flex items-center gap-2">
                <CircularProgressBar
                  value={submissionTimeLeft.value}
                  type={submissionTimeLeft.type}
                  size={50}
                  strokeWidth={3}
                  color="#FFE25B"
                  initialHours={timerValues.submissionHours}
                  initialMinutes={timerValues.submissionMinutes}
                  initialSeconds={timerValues.submissionSeconds}
                />
              </div>
            ) : (
              <div className="w-50 h-50"></div>
            )}
          </div>
        </div>

        <div className={`grid ${compact ? `grid-cols-[1fr,0.5fr]` : `grid-cols-[1fr,auto]`}  items-start`}>
          <div className={`flex items-center ${votingClass} justify-between gap-3`}>
            <div>
              <p className="font-bold">
                {loading ? (
                  <Skeleton width={150} />
                ) : (
                  <>
                    {votingStatus}{" "}
                    {votingStatus.includes("in:") && (
                      <Countdown
                        date={moment(contest.vote_start_at).toDate()}
                        renderer={props => renderer(props, moment(contest.vote_start_at))}
                        onComplete={() => setOnCountdownComplete(true)}
                      />
                    )}
                  </>
                )}
              </p>
              {loading ? <Skeleton width={185} /> : votingMessage}
            </div>
          </div>
          {loading ? (
            <Skeleton circle height={50} width={50} />
          ) : votingTimeLeft.value ? (
            <div className="flex items-center gap-2">
              <CircularProgressBar
                value={votingTimeLeft.value}
                type={votingTimeLeft.type}
                size={50}
                strokeWidth={3}
                color="#78FFC6"
                initialHours={timerValues.votingHours}
                initialMinutes={timerValues.votingMinutes}
                initialSeconds={timerValues.votingSeconds}
              />
            </div>
          ) : (
            <div className="w-50 h-50"></div>
          )}
        </div>
        {contest.rewards ? (
          <div className="flex flex-col">
            <p className="font-bold">
              {loading ? (
                <Skeleton width={100} />
              ) : (
                <>
                  {parseInt(contest.rewards.token.value, 10)}{" "}
                  <span className="uppercase">${contest.rewards.token.symbol}</span>
                </>
              )}
            </p>
            <p>{loading ? <Skeleton width={100} /> : `to ${contest.rewards.winners} winners`}</p>
          </div>
        ) : (
          <p className="text-neutral-9 font-bold">{loading ? <Skeleton width={70} /> : "no rewards"}</p>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default Contest;
