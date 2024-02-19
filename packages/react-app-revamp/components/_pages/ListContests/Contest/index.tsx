/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import CircularProgressBar from "@components/Clock";
import CheckmarkIcon from "@components/UI/Icons/Checkmark";
import { ROUTE_VIEW_CONTEST_BASE_PATH, ROUTE_VIEW_UPCOMING_CONTESTS } from "@config/routes";
import { chains, chainsImages } from "@config/wagmi";
import { pluralize } from "@helpers/pluralize";
import useContestInfo from "@hooks/useContestInfo";
import { useError } from "@hooks/useError";
import useTokenDetails from "@hooks/useTokenDetails";
import { toggleContestVisibility } from "lib/creator";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAccount } from "wagmi";

interface ContestProps {
  contest: any;
  rewards: any;
  compact: boolean;
  loading: boolean;
  rewardsLoading: boolean;
  allowToHide?: boolean;
}

export type TimeLeft = {
  value: number;
  type: "days" | "hours" | "minutes";
};

const Contest: FC<ContestProps> = ({ contest, compact, loading, rewards, allowToHide, rewardsLoading }) => {
  const { address } = useAccount();
  const router = useRouter();
  const [contestReward, setContestReward] = useState<any>(null);
  const isUpcomingContest = router.pathname === ROUTE_VIEW_UPCOMING_CONTESTS;
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const { handleError } = useError();
  const [isHidden, setIsHidden] = useState(contest.hidden);
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

  const votingRequirement = contest.voting_requirements;
  const submissionRequirement = contest.submission_requirements;
  const { tokenSymbol: votingRequirementToken, isLoading: isVotingRequirementTokenLoading } = useTokenDetails(
    votingRequirement?.type,
    votingRequirement?.tokenAddress,
    votingRequirement?.chain,
  );
  const { tokenSymbol: submissionRequirementToken, isLoading: isSubmissionRequirementTokenLoading } = useTokenDetails(
    submissionRequirement?.type,
    submissionRequirement?.tokenAddress,
    submissionRequirement?.chain,
  );

  const getContestUrl = (contest: { network_name: string; address: string }) => {
    return ROUTE_VIEW_CONTEST_BASE_PATH.replace("[chain]", contest.network_name).replace("[address]", contest.address);
  };

  useEffect(() => {
    if (rewardsLoading || loading) return;

    const contestReward = rewards.find((reward: any) => reward && reward.contestAddress === contest.address);

    setContestReward(contestReward || null);
  }, [rewardsLoading, loading, rewards, contest.address]);

  useEffect(() => {
    const now = moment();

    if (now.isBefore(moment(contest.start_at))) {
      const submissionsDaysLeft = moment(contest.start_at).diff(now, "days");

      if (submissionsDaysLeft > 5) {
        setSubmissionStatus("Submissions open on:");
      } else {
        setSubmissionStatus("Submissions open in:");
      }
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
      const votingDaysLeft = moment(contest.vote_start_at).diff(now, "days");

      if (votingDaysLeft > 5) {
        setVotingStatus("Voting opens on:");
      } else {
        setVotingStatus("Voting opens in:");
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contest, onCountdownComplete]);

  const renderer = ({ days, hours, minutes, seconds }: CountdownRenderProps, targetDate: moment.Moment) => {
    if (days > 5) {
      return <span>{targetDate.format("MMMM Do")}</span>;
    } else if (days > 0) {
      return <span>{pluralize(days, "day", "days")}</span>;
    } else if (hours > 0) {
      return <span>{pluralize(hours, "hour", "hours")}</span>;
    } else if (minutes > 0) {
      return <span>{pluralize(minutes, "minute", "minutes")}</span>;
    } else {
      return <span>{pluralize(seconds, "second", "seconds")}</span>;
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
      if (contest.qualifiedToSubmit || contest.anyoneCanSubmit) {
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
    if (!address) return "";

    if (submissionTimeLeft.value) {
      if (contest.qualifiedToSubmit || contest.anyoneCanSubmit) {
        return (
          <span className="flex items-center gap-1">
            you qualify! <CheckmarkIcon />
          </span>
        );
      } else if (submissionRequirement) {
        return (
          <p>
            for{" "}
            <span className="uppercase">
              {submissionRequirement?.type === "erc20" ? "$" : ""}
              {submissionRequirementToken}
            </span>{" "}
            holders
          </p>
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
      } else if (votingRequirement) {
        return (
          <p>
            for{" "}
            <span className="uppercase">
              {votingRequirement?.type === "erc20" ? "$" : ""}
              {votingRequirementToken}
            </span>{" "}
            holders
          </p>
        );
      } else {
        return "you don't qualify :(";
      }
    } else {
      return "";
    }
  };

  const getQualificationMessage = () => {
    if ((contest.qualifiedToSubmit || contest.anyoneCanSubmit) && contest.qualifiedToVote) {
      return "you qualify to submit & vote";
    } else if (contest.qualifiedToSubmit || contest.anyoneCanSubmit) {
      return "you qualify to submit but not vote";
    } else if (contest.qualifiedToVote) {
      return "you don't qualify to submit but you can vote";
    } else {
      return "you don't qualify to submit or vote";
    }
  };

  const handleToggleContestView = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();

    const newState = !isHidden;
    setIsHidden(newState);

    try {
      await toggleContestVisibility(contest.address, contest.network_name, contest.author_address, newState);
    } catch (error) {
      handleError(e, "Something went wrong and we couldn't toggle contest visibility.");
      setIsHidden(!newState);
    }
  };

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {allowToHide ? (
        <div className="flex lg:hidden border-t border-neutral-9 pt-4 pl-3">
          <div className="flex items-center justify-center gap-8">
            <img
              className="w-8 h-8 hover:opacity-80 ml-[10px]"
              src={isHidden ? "/user/private.svg" : "/user/public.svg"}
              alt={isHidden ? "private" : "public"}
              onClick={handleToggleContestView}
            />
            <p className="text-[16px] uppercase">{isHidden ? "private" : "public"}</p>
          </div>
        </div>
      ) : null}

      <Link href={getContestUrl(contest)}>
        <div
          className="hidden lg:full-width-grid-cols md:items-center border-t border-neutral-9 py-4 p-3 
        hover:bg-neutral-3 transition-colors duration-500 ease-in-out cursor-pointer"
          key={`live-contest-${contest.id}`}
        >
          <div className="flex items-center gap-4">
            {loading ? (
              <Skeleton circle height={32} width={32} />
            ) : allowToHide ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <img className="w-8 h-8" src={chainsImages[contest.network_name]} alt="" />
                <img
                  className="w-6 h-6 hover:opacity-80"
                  src={isHidden ? "/user/private.svg" : "/user/public.svg"}
                  alt={isHidden ? "private" : "public"}
                  onClick={handleToggleContestView}
                />
                <p className="text-[12px]">{isHidden ? "private" : "public"}</p>
              </div>
            ) : (
              <img className="w-8 h-8" src={chainsImages[contest.network_name]} alt="" />
            )}

            <div className="flex flex-col items-start w-full">
              <p className="font-bold w-full">{loading ? <Skeleton width={200} /> : contest.title}</p>
              <p>{loading ? <Skeleton width={200} /> : contest.summary}</p>
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <div className="self-start inline-flex items-center px-2 h-4 leading-tight pb-1 mt-1 bg-neutral-9 rounded-[5px] border-0 text-true-black text-[12px] font-bold">
                  {contest.type}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center ${submissionClass} md:justify-between gap-3`}>
              <div className="min-w-[185px] min-h-[3rem] flex flex-col justify-center">
                <p className="font-bold">
                  {loading ? (
                    <Skeleton width={185} />
                  ) : (
                    <>
                      {submissionStatus}{" "}
                      {submissionStatus.includes("in:") || submissionStatus.includes("on:") ? (
                        <Countdown
                          date={moment(contest.start_at).toDate()}
                          renderer={(props: CountdownRenderProps) => renderer(props, moment(contest.start_at))}
                          onComplete={() => setOnCountdownComplete(true)}
                        />
                      ) : null}
                    </>
                  )}
                </p>
                {loading ? <Skeleton width={185} /> : submissionMessage}
              </div>
              {loading ? (
                <Skeleton circle height={50} width={50} />
              ) : submissionTimeLeft.value ? (
                <div className="flex gap-2">
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
              <div className="min-w-[185px] min-h-[3rem] flex flex-col justify-center">
                <p className="font-bold">
                  {loading ? (
                    <Skeleton width={185} />
                  ) : (
                    <>
                      {votingStatus}{" "}
                      {votingStatus.includes("Voting opens in:") || votingStatus.includes("Voting opens on:") ? (
                        <Countdown
                          date={moment(contest.vote_start_at).toDate()}
                          renderer={(props: CountdownRenderProps) => renderer(props, moment(contest.vote_start_at))}
                          onComplete={() => setOnCountdownComplete(true)}
                        />
                      ) : null}
                    </>
                  )}
                </p>
                {loading ? <Skeleton width={185} /> : votingMessage}
              </div>
            </div>
            {loading ? (
              <Skeleton circle height={50} width={50} />
            ) : votingTimeLeft.value ? (
              <div className="flex gap-2">
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
          <div className="flex flex-col">
            <p className={`font-bold w-full ${contestReward ? "text-neutral-11" : "text-neutral-9"} `}>
              {rewardsLoading || loading ? (
                <Skeleton />
              ) : contestReward ? (
                <>
                  {contestReward.token.value} <span className="uppercase">${contestReward.token.symbol}</span>
                </>
              ) : (
                "No rewards"
              )}
            </p>
            {contestReward && (
              <p>
                {rewardsLoading || loading ? (
                  <Skeleton />
                ) : (
                  `to ${contestReward.winners} ${contestReward.winners > 1 ? "winners" : "winner"}`
                )}
              </p>
            )}
          </div>
        </div>

        {/*  Mobile */}

        <div
          className={`flex flex-col gap-2 mb-4 pl-3 ${allowToHide ? "" : "border-t border-neutral-9"} pt-8 p-3 
          hover:bg-neutral-3 transition-colors duration-500 ease-in-out cursor-pointer lg:hidden`}
        >
          <div className="flex items-center gap-6">
            {loading ? (
              <Skeleton circle height={50} width={50} />
            ) : (
              <img className="w-[50px] h-auto" src={chainsImages[contest.network_name]} alt="" />
            )}
            <div className="flex flex-col gap-1">
              <p className="font-bold">{loading ? <Skeleton width={200} /> : contest.title}</p>
              <p>{loading ? <Skeleton width={200} /> : contest.summary}</p>
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <div className="self-start inline-flex items-center px-2 h-4 leading-tight pb-1 mt-1 bg-neutral-9 rounded-[5px] border-0 text-true-black text-[12px] font-bold">
                  {contest.type}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row pl-14">
            <ul className="list-disc list-inside text-[16px] list-explainer w-full">
              {loading ? (
                <Skeleton count={3} />
              ) : (
                <>
                  {!address ? (
                    <li>
                      <span className="text-positive-11">connect wallet</span> to see if you qualify
                    </li>
                  ) : null}

                  {isUpcomingContest && address ? <li>{getQualificationMessage()}</li> : null}

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

                  {rewardsLoading || loading ? (
                    <li>
                      <Skeleton width={100} />
                    </li>
                  ) : contestReward ? (
                    <li>
                      {contestReward.token.value}
                      <span className="uppercase"> ${contestReward.token.symbol} </span>
                      to {contestReward.winners} {contestReward.winners > 1 ? "winners" : "winner"}
                    </li>
                  ) : null}
                </>
              )}
            </ul>
          </div>

          <div className={`${!submissionTimeLeft.value && !votingTimeLeft.value && !loading ? "hidden" : ""}`}>
            <div className={`flex items-center gap-6 mt-5`}>
              {loading ? (
                <Skeleton circle width={50} height={50} />
              ) : submissionTimeLeft.value ? (
                <CircularProgressBar
                  value={submissionTimeLeft.value}
                  type={submissionTimeLeft.type}
                  size={48}
                  strokeWidth={2}
                  color="#FFE25B"
                  initialHours={timerValues.submissionHours}
                  initialMinutes={timerValues.submissionMinutes}
                  initialSeconds={timerValues.submissionSeconds}
                />
              ) : votingTimeLeft.value ? (
                <div className="flex items-center">
                  <CircularProgressBar
                    value={votingTimeLeft.value}
                    type={votingTimeLeft.type}
                    size={48}
                    strokeWidth={2}
                    color="#78FFC6"
                    initialHours={timerValues.votingHours}
                    initialMinutes={timerValues.votingMinutes}
                    initialSeconds={timerValues.votingSeconds}
                  />
                </div>
              ) : null}
              <div className="flex flex-col w-full">
                <p className={`w-full uppercase ${getTextClassForMobiles()} mt-[5px]`}>
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
      </Link>
    </SkeletonTheme>
  );
};

export default Contest;
