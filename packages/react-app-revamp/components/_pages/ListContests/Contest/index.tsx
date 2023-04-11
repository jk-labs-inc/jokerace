import CircularProgressBar from "@components/Clock";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { chains, chainsImages } from "@config/wagmi";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { getAccount } from "@wagmi/core";
import moment from "moment";
import router from "next/router";
import { FC, useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

interface ContestProps {
  contest: any;
}

type TimeLeft = {
  value: number;
  type: "hours" | "minutes";
};

const Contest: FC<ContestProps> = ({ contest }) => {
  const { address } = getAccount();
  const chain = chains.find(
    c => c.name.replace(/\s+/g, "").toLowerCase() === contest.network_name.replace(/\s+/g, "").toLowerCase(),
  );
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
  const [initialSubmissionMinutes, setInitialSubmissionMinutes] = useState(0);

  const [initialVotingMinutes, setInitialVotingMinutes] = useState(0);

  const [initialSubmissionSeconds, setInitialSubmissionSeconds] = useState(0);
  const [initialVotingSeconds, setInitialVotingSeconds] = useState(0);

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

      const minutesLeft = moment(contest.vote_start_at).diff(now, "minutes");
      const hoursLeft = Math.floor(minutesLeft / 60);
      const secondsLeft = moment(contest.vote_start_at).diff(now, "seconds");

      setInitialSubmissionMinutes(minutesLeft % 60);
      setInitialSubmissionSeconds(secondsLeft % 60);

      if (minutesLeft < 60) {
        setSubmissionTimeLeft({ value: minutesLeft, type: "minutes" });
      } else if (hoursLeft < 24) {
        setSubmissionTimeLeft({ value: hoursLeft, type: "hours" });
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

      setInitialVotingMinutes(minutesLeft % 60);
      setInitialVotingSeconds(secondsLeft % 60);

      if (minutesLeft < 60) {
        setVotingTimeLeft({ value: minutesLeft, type: "minutes" });
      } else if (hoursLeft < 24) {
        setVotingTimeLeft({ value: hoursLeft, type: "hours" });
      }
    } else {
      setVotingStatus("Voting closed");
    }
  }, [contest]);

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

  const submissionClass = (() => {
    if (submissionStatus === "Submissions closed") {
      return "text-neutral-9";
    }

    if (contest.qualifiedToSubmit || !address) {
      if (submissionStatus === "Submissions are open") {
        return "text-primary-10";
      }

      return "text-true-white";
    }

    return "text-neutral-9";
  })();

  const votingClass = (() => {
    if (votingStatus === "Voting closed") {
      return "text-neutral-9";
    }

    if (contest.qualifiedToVote || !address) {
      if (votingStatus === "Voting is open") {
        return "text-positive-11";
      }

      return "text-true-white";
    }

    return "text-neutral-9";
  })();

  const submissionMessage = (() => {
    if (submissionStatus === "Submissions closed") {
      return null;
    }

    if (contest.qualifiedToSubmit) {
      return (
        <div className="flex flex-nowrap items-center gap-1">
          <CheckIcon className="w-5 mt-1" />
          <p>you qualify</p>
        </div>
      );
    }

    if (!address) {
      return (
        <p>
          for <span className="uppercase">${chain?.nativeCurrency?.symbol}</span> holders
        </p>
      );
    }

    return (
      <p>
        you need <span className="uppercase">${chain?.nativeCurrency?.symbol}</span>
      </p>
    );
  })();

  const votingMessage = (() => {
    if (votingStatus === "Voting closed") {
      return null;
    }

    if (contest.qualifiedToVote) {
      return (
        <div className="flex flex-nowrap items-center gap-1">
          <CheckIcon className="w-5 mt-1" />
          <p>you qualify</p>
        </div>
      );
    }

    if (!address) {
      return (
        <p>
          for <span className="uppercase">${contest.token_symbol}</span> holders
        </p>
      );
    }

    if (votingStatus === "Voting is open") {
      return (
        <div className="flex flex-nowrap items-center gap-1">
          <XIcon className="w-5 mt-1" />
          <p>
            you needed <span className="uppercase">${contest.token_symbol}</span>
          </p>
        </div>
      );
    }

    return (
      <p>
        you need <span className="uppercase">${contest.token_symbol}</span>
      </p>
    );
  })();

  return (
    <div
      className="full-width-grid-cols border-t border-neutral-9 py-6 items-center p-3 hover:bg-neutral-0 transition-all duration-200 cursor-pointer"
      key={`live-contest-${contest.id}`}
      onClick={() => handleClick(contest)}
    >
      <div className="flex items-center gap-4">
        <img className="w-8 h-auto" src={chainsImages[contest.network_name]} alt="" />
        <p className="font-bold">{contest.title}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center ${submissionClass} justify-between gap-3`}>
          <div className="min-w-[185px]">
            <p className="font-bold">
              {submissionStatus}{" "}
              {submissionStatus.includes("in:") && (
                <Countdown
                  date={moment(contest.start_at).toDate()}
                  renderer={props => renderer(props, moment(contest.start_at))}
                />
              )}
            </p>
            {submissionMessage}
          </div>
          {submissionTimeLeft.value ? (
            <div className="flex items-center gap-2">
              <CircularProgressBar
                value={submissionTimeLeft.value}
                type={submissionTimeLeft.type}
                size={50}
                strokeWidth={3}
                color="#FFE25B"
                initialMinutes={initialSubmissionMinutes}
                initialSeconds={initialSubmissionSeconds}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className={`flex items-center gap-4`}>
        <div className={`flex items-center ${votingClass} justify-between gap-3`}>
          <div className="min-w-[185px]">
            {" "}
            <p className="font-bold">
              {votingStatus}{" "}
              {votingStatus.includes("in:") && (
                <Countdown
                  date={moment(contest.vote_start_at).toDate()}
                  renderer={props => renderer(props, moment(contest.vote_start_at))}
                />
              )}
            </p>
            {votingMessage}
          </div>
        </div>
        {votingTimeLeft.value ? (
          <div className="flex items-center gap-2">
            <CircularProgressBar
              value={votingTimeLeft.value}
              type={votingTimeLeft.type}
              size={50}
              strokeWidth={3}
              color="#78FFC6"
              initialMinutes={initialVotingMinutes}
              initialSeconds={initialVotingSeconds}
            />
          </div>
        ) : null}
      </div>
      {contest.rewards ? (
        <div className="flex flex-col">
          <p className="font-bold">
            {parseInt(contest.rewards.token.value, 10)}{" "}
            <span className="uppercase">${contest.rewards.token.symbol}</span>
          </p>
          <p>to {contest.rewards.winners} winners</p>
        </div>
      ) : (
        <p className="text-neutral-9 font-bold">no rewards</p>
      )}
    </div>
  );
};

export default Contest;
