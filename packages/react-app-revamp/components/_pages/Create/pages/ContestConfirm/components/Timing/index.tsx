import moment from "moment-timezone";
import { FC, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Steps } from "../..";
import {
  TimingPeriod,
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "../../../ContestTiming/utils";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmTimingProps {
  timing: {
    submissionOpen: Date;
    votingOpen: Date;
    votingClose: Date;
  };
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmTiming: FC<CreateContestConfirmTimingProps> = ({ timing, step, onClick }) => {
  const { submissionOpen, votingOpen, votingClose } = timing;
  const [isHovered, setIsHovered] = useState(false);
  const timingOptionForSubmissionPeriod = useTimingOptionForSubmissionPeriod(state => state.timingOption);
  const timingOptionForVotingPeriod = useTimingOptionForVotingPeriod(state => state.timingOption);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  const formattedSubmissionOpen =
    moment(submissionOpen).format("MMMM D, YYYY h:mmA") + " " + moment.tz(moment.tz.guess()).zoneAbbr();
  const formattedVoteOpen =
    moment(votingOpen).format("MMMM D, YYYY h:mmA") + " " + moment.tz(moment.tz.guess()).zoneAbbr();
  const formattedVotesClose =
    moment(votingClose).format("MMMM D, YYYY h:mmA") + " " + moment.tz(moment.tz.guess()).zoneAbbr();

  const formatSubmissionPeriod = useMemo<string>(() => {
    const timingOption = timingOptionForSubmissionPeriod.value as TimingPeriod;

    switch (timingOption) {
      case TimingPeriod.OneDay:
        return `one day to enter: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneHour:
        return `one hour to enter: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneWeek:
        return `one week to enter: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneMonth:
        return `one month to enter: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      default:
        return `enter contest within ${formattedSubmissionOpen} - ${formattedVoteOpen}`;
    }
  }, [formattedSubmissionOpen, formattedVoteOpen, timingOptionForSubmissionPeriod]);

  const formatVotingPeriod = useMemo<string>(() => {
    const timingOption = timingOptionForVotingPeriod.value as TimingPeriod;

    switch (timingOption) {
      case TimingPeriod.OneDay:
        return `one day to vote: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneHour:
        return `one hour to vote: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneWeek:
        return `one week to vote: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneMonth:
        return `one month to vote: ${formattedVoteOpen} to ${formattedVotesClose}`;
      default:
        return `vote within ${formattedVoteOpen} - ${formattedVotesClose}`;
    }
  }, [formattedVotesClose, formattedVoteOpen, timingOptionForVotingPeriod]);

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div
        className={`flex flex-col gap-4 ${
          isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"
        } transition-colors duration-300`}
      >
        <p className="text-[16px] font-bold">timing:</p>
        <ul className="flex flex-col pl-8">
          <li className="text-[16px] list-disc">{formatSubmissionPeriod}</li>
          <li className="text-[16px] list-disc">{formatVotingPeriod}</li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmTiming;
