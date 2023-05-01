/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import CircularProgressBar from "@components/Clock";
import CheckmarkIcon from "@components/UI/Icons/Checkmark";
import { ROUTE_VIEW_CONTEST_BASE_PATH } from "@config/routes";
import { chains, chainsImages } from "@config/wagmi";
import useContestInfo from "@hooks/useContestInfo";
import { getAccount } from "@wagmi/core";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface ContestProps {
  contest: any;
  compact: boolean;
  loading: boolean;
}

export type TimeLeft = {
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
    submissionTimeLeft,
    votingTimeLeft,
  });

  const [timerValues, setTimerValues] = useState({
    submissionHours: 0,
    submissionMinutes: 0,
    submissionSeconds: 0,
    votingHours: 0,
    votingMinutes: 0,
    votingSeconds: 0,
  });

  const getContestUrl = (contest: { network_name: string; address: string }) => {
    return ROUTE_VIEW_CONTEST_BASE_PATH.replace("[chain]", contest.network_name).replace("[address]", contest.address);
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

      if (minutesLeft < 60 && hoursLeft < 1) {
        setSubmissionTimeLeft({ value: minutesLeft, type: "minutes" });
      } else if (hoursLeft < 24 || (hoursLeft === 24 && minutesLeft > 0)) {
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

      if (minutesLeft < 60 && hoursLeft < 1) {
        setVotingTimeLeft({ value: minutesLeft, type: "minutes" });
      } else if (hoursLeft < 24 || (hoursLeft === 24 && minutesLeft > 0)) {
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

  const getStatusText = (startDate: Date, endDate: Date) => {
    const currentDate = moment();
    const start = moment(startDate);

    if (currentDate.isBefore(start)) {
      return "runs";
    } else {
      return "run";
    }
  };

  const getTextClassForMobiles = () => {
    if (!address) {
      if (submissionTimeLeft.value) {
        return "text-primary-10";
      } else {
        return "text-positive-11";
      }
    } else if (submissionTimeLeft.value) {
      if (contest.qualifiedToSubmit) {
        return "text-primary-10";
      } else {
        return "text-negative-10";
      }
    } else if (votingTimeLeft.value) {
      if (contest.qualifiedToVote) {
        return "text-positive-11";
      } else {
        return "text-negative-10";
      }
    } else {
      return null;
    }
  };

  const getTextRequirementForMobiles = () => {
    if (!address) return null;

    if (submissionTimeLeft.value) {
      if (contest.qualifiedToSubmit) {
        return (
          <span className="flex items-center gap-1">
            you qualify! <CheckmarkIcon />
          </span>
        );
      } else {
        return "you don't qualify :(";
      }
    } else if (votingTimeLeft.value) {
      if (contest.qualifiedToVote) {
        return (
          <span className="flex items-center gap-1">
            you qualify! <CheckmarkIcon />
          </span>
        );
      } else {
        return "you don't qualify :(";
      }
    } else {
      return null;
    }
  };

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={2}>
      <a href={getContestUrl(contest)}>
        <div
          className="hidden lg:full-width-grid-cols md:items-center border-t border-neutral-9 py-6 p-3 
        hover:bg-neutral-0 transition-colors duration-300 ease-in-out cursor-pointer"
          key={`live-contest-${contest.id}`}
        >
          <div className="flex items-center gap-4">
            {loading ? (
              <Skeleton circle height={32} width={32} />
            ) : (
              <img className="w-8 h-auto" src={chainsImages[contest.network_name]} alt="" />
            )}
            <p className="font-bold w-full">{loading ? <Skeleton /> : contest.title}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center ${submissionClass} md:justify-between gap-3`}>
              <div className="min-w-[185px]">
                <p className="font-bold">
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {submissionStatus}{" "}
                      {submissionStatus.includes("in:") && (
                        <Countdown
                          date={moment(contest.start_at).toDate()}
                          renderer={(props: CountdownRenderProps) => renderer(props, moment(contest.start_at))}
                          onComplete={() => setOnCountdownComplete(true)}
                        />
                      )}
                    </>
                  )}
                </p>
                {loading ? <Skeleton /> : submissionMessage}
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

          <div className="flex items-center gap-4">
            <div className={`flex items-center ${votingClass} md:justify-between gap-3`}>
              <div className="min-w-[185px]">
                <p className="font-bold">
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {/* TODO - if contests ends, it does not apply */}
                      {votingStatus}{" "}
                      {votingStatus.includes("in:") && (
                        <Countdown
                          date={moment(contest.vote_start_at).toDate()}
                          renderer={(props: CountdownRenderProps) => renderer(props, moment(contest.vote_start_at))}
                          onComplete={() => setOnCountdownComplete(true)}
                        />
                      )}
                    </>
                  )}
                </p>
                {loading ? <Skeleton /> : votingMessage}
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
              <p className="font-bold w-full">
                {loading ? (
                  <Skeleton />
                ) : (
                  <>
                    {parseInt(contest.rewards.token.value, 10)}{" "}
                    <span className="uppercase">${contest.rewards.token.symbol}</span>
                  </>
                )}
              </p>
              <p>{loading ? <Skeleton /> : `to ${contest.rewards.winners} winners`}</p>
            </div>
          ) : (
            <p className="text-neutral-9 font-bold">{loading ? <Skeleton /> : "no rewards"}</p>
          )}
        </div>
        {/*  Mobile */}
        <div
          className="mb-4 flex flex-col gap-2 border-t border-neutral-9 pt-8 p-3 
        hover:bg-neutral-0 transition-colors duration-300 ease-in-out cursor-pointer lg:hidden"
        >
          <div className="flex items-center gap-9">
            {loading ? (
              <Skeleton circle height={32} width={32} />
            ) : (
              <img className="w-8 h-auto" src={chainsImages[contest.network_name]} alt="" />
            )}
            <p className="font-bold w-full uppercase">{loading ? <Skeleton /> : contest.title}</p>
          </div>
          <div className="flex flex-row pl-12">
            <ul className="list-disc list-inside text-[16px]  list-explainer w-full">
              {loading ? (
                <Skeleton count={3} />
              ) : (
                <>
                  {!address ? (
                    <li>
                      <span className="text-positive-11">connect</span> a wallet to see if you qualify
                    </li>
                  ) : null}

                  <li>
                    {submissionTimeLeft.value ? (
                      <>
                        submissions {getStatusText(contest.start_at, contest.vote_start_at)}{" "}
                        {moment(contest.start_at).format("MMM D")} - {moment(contest.vote_start_at).format("MMM D")}
                      </>
                    ) : (
                      "submissions closed"
                    )}
                  </li>
                  <li>
                    {votingTimeLeft.value || votingStatus.includes("in:") ? (
                      <>
                        voting {getStatusText(contest.vote_start_at, contest.end_at)}{" "}
                        {moment(contest.vote_start_at).format("MMM D")} - {moment(contest.end_at).format("MMM D")}
                      </>
                    ) : (
                      "voting closed"
                    )}
                  </li>
                  {contest.rewards ? (
                    <li>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        <>
                          {parseInt(contest.rewards.token.value, 10)}{" "}
                          <span className="uppercase">${contest.rewards.token.symbol}</span>
                        </>
                      )}

                      {loading ? <Skeleton /> : ` to ${contest.rewards.winners} winners`}
                    </li>
                  ) : null}
                </>
              )}
            </ul>
          </div>

          <div className={`${!submissionTimeLeft.value && !votingTimeLeft.value && !loading ? "hidden" : ""}`}>
            <div className={`flex ${address ? `items-baseline` : "items-center"} gap-5 -ml-[10px] mt-5`}>
              {loading ? (
                <Skeleton circle width={50} height={50} />
              ) : submissionTimeLeft.value ? (
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
              ) : null}
              <div className="flex flex-col w-full">
                <p className={`w-full uppercase ${getTextClassForMobiles()}`}>
                  {loading ? (
                    <Skeleton />
                  ) : submissionTimeLeft.value ? (
                    "submissions open"
                  ) : votingTimeLeft.value ? (
                    "voting open"
                  ) : null}
                </p>
                <p className={`w-full ${getTextClassForMobiles()}`}>
                  {loading ? <Skeleton /> : getTextRequirementForMobiles()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </SkeletonTheme>
  );
};

export default Contest;
