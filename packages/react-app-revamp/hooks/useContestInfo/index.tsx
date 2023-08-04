/* eslint-disable react/no-unescaped-entities */
import CheckmarkIcon from "@components/UI/Icons/Checkmark";
import CrossIcon from "@components/UI/Icons/Cross";
import { TimeLeft } from "@components/_pages/ListContests/Contest";
import { useEffect, useState } from "react";
import { Chain } from "wagmi";

interface ContestInfoProps {
  loading: boolean;
  submissionStatus: string;
  votingStatus: string;
  contest: any;
  chains: Chain[];
  address?: string;
  submissionTimeLeft: TimeLeft;
  votingTimeLeft: TimeLeft;
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
  submissionTimeLeft,
  votingTimeLeft,
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

      if (contest.qualifiedToSubmit || contest.anyoneCanSubmit || !address) {
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
  }, [
    submissionStatus,
    votingStatus,
    contest.qualifiedToSubmit,
    contest.qualifiedToVote,
    address,
    contest.anyoneCanSubmit,
  ]);

  useEffect(() => {
    const newSubmissionMessage = (() => {
      if (loading) return;

      if (submissionStatus === "Submissions closed") {
        return null;
      }

      if (contest.qualifiedToSubmit) {
        return (
          <div className="flex flex-nowrap items-center gap-1">
            <CheckmarkIcon color={submissionTimeLeft.value ? `#FFE25B` : `#FFFF`} />
            <p>you qualify</p>
          </div>
        );
      }

      if (contest.anyoneCanSubmit) {
        return "for everyone";
      }

      if (!address) {
        if (contest.anyoneCanSubmit) {
          return "for everyone";
        } else {
          return "for allowlisted";
        }
      }

      return <p>you aren't allowlisted</p>;
    })();

    const newVotingMessage = (() => {
      if (votingStatus === "Voting closed") {
        return null;
      }
      if (contest.qualifiedToVote) {
        return (
          <div className="flex flex-nowrap items-center gap-1">
            <CheckmarkIcon color={votingStatus === "Voting is open" ? `#78FFC6` : `#FFFF`} />
            <p>you qualify</p>
          </div>
        );
      }

      if (!address) {
        return <p>for allowlisted</p>;
      }

      if (votingStatus === "Voting is open") {
        return (
          <div className="flex flex-nowrap items-center gap-1">
            <CrossIcon />
            <p>you aren't allowlisted</p>
          </div>
        );
      }

      return <p>you aren't allowlisted</p>;
    })();

    setSubmissionMessage(newSubmissionMessage);
    setVotingMessage(newVotingMessage);
  }, [
    loading,
    submissionStatus,
    votingStatus,
    contest.qualifiedToSubmit,
    contest.qualifiedToVote,
    address,
    chains,
    contest.token_symbol,
    contest.network_name,
    contest.anyoneCanSubmit,
    submissionTimeLeft.value,
  ]);

  return { submissionClass, votingClass, submissionMessage, votingMessage };
};

export default useContestInfo;
