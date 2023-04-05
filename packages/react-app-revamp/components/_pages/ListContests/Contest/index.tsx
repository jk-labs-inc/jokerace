import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { chains, chainsImages } from "@config/wagmi";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { useUserBalance } from "@hooks/useUserBalance";
import { getAccount } from "@wagmi/core";
import { fetchUserBalance } from "lib/fetchUserBalance";
import moment from "moment";
import router from "next/router";
import { FC, useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

interface ContestProps {
  contest: any;
}

const Contest: FC<ContestProps> = ({ contest }) => {
  const { address } = getAccount();
  const chain = chains.find(
    c => c.name.replace(/\s+/g, "").toLowerCase() === contest.network_name.replace(/\s+/g, "").toLowerCase(),
  );
  const { qualified: qualifiedToVote, loading: loadingWithToken } = useUserBalance(
    address ?? "",
    chain?.id ?? 0,
    contest.token_address,
  );
  const { qualified: qualifiedToSubmit, loading: loadingWithoutToken } = useUserBalance(address ?? "", chain?.id ?? 0);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
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
    } else {
      setSubmissionStatus("Submissions closed");
    }

    if (now.isBefore(moment(contest.vote_start_at))) {
      setVotingStatus("Voting opens in:");
    } else if (now.isBefore(moment(contest.end_at))) {
      setVotingStatus("Voting is open");
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

    if (qualifiedToSubmit || !address) {
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

    if (qualifiedToVote || !address) {
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

    if (qualifiedToSubmit) {
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

    if (qualifiedToVote) {
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
        <p>{contest.title}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex flex-col ${submissionClass}`}>
          <p>
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
      </div>

      <div className={`flex flex-col ${votingClass}`}>
        <p>
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

      {contest.rewards ? (
        <div className="flex flex-col">
          <p>
            1000 <span className="uppercase">$JOKE</span>
          </p>
          <p>to 3 winners</p>
        </div>
      ) : (
        <p className="text-neutral-9">no rewards</p>
      )}
    </div>
  );
};

export default Contest;
