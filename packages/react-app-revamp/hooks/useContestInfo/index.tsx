import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { FC, useEffect, useState } from "react";
import { Chain } from "wagmi";

interface ContestInfoProps {
  loading: boolean;
  submissionStatus: string;
  votingStatus: string;
  contest: any;
  chains: Chain[];
  address?: string;
}

type UseContestInfoReturn = {
  submissionClass: string;
  votingClass: string;
  submissionMessage: React.ReactNode;
  votingMessage: React.ReactNode;
};

const useContestInfo = ({
  loading,
  submissionStatus,
  votingStatus,
  contest,
  address = "",
  chains,
}: ContestInfoProps): UseContestInfoReturn => {
  const [submissionClass, setSubmissionClass] = useState("");
  const [votingClass, setVotingClass] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState<React.ReactNode>(null);
  const [votingMessage, setVotingMessage] = useState<React.ReactNode>(null);

  useEffect(() => {
    const newSubmissionClass = (() => {
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

    const newVotingClass = (() => {
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

    setSubmissionClass(newSubmissionClass);
    setVotingClass(newVotingClass);
  }, [submissionStatus, votingStatus, contest.qualifiedToSubmit, contest.qualifiedToVote, address]);

  useEffect(() => {
    const newSubmissionMessage = (() => {
      if (loading) return;

      const chain = chains.find(
        c => c.name.replace(/\s+/g, "").toLowerCase() === contest.network_name.replace(/\s+/g, "").toLowerCase(),
      );
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
            for{" "}
            <span className="uppercase">
              ${contest.submissionGatingByVotingToken ? contest.token_symbol : chain?.nativeCurrency?.symbol}
            </span>{" "}
            holders
          </p>
        );
      }

      return (
        <p>
          you need{" "}
          <span className="uppercase">
            ${contest.submissionGatingByVotingToken ? contest.token_symbol : chain?.nativeCurrency?.symbol}
          </span>
        </p>
      );
    })();

    const newVotingMessage = (() => {
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

    setSubmissionMessage(newSubmissionMessage);
    setVotingMessage(newVotingMessage);
  }, [
    loading,
    submissionStatus,
    votingStatus,
    contest.qualifiedToSubmit,
    contest.qualifiedToVote,
    contest.submissionGatingByVotingToken,
    address,
    chains,
    contest.token_symbol,
    contest.network_name,
  ]);

  return { submissionClass, votingClass, submissionMessage, votingMessage };
};

export default useContestInfo;
