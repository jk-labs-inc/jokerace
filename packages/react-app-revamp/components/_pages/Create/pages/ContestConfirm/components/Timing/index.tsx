import moment from "moment-timezone";
import { FC, useMemo } from "react";
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
  step: number;
  onClick?: (stepIndex: number) => void;
}

const CreateContestConfirmTiming: FC<CreateContestConfirmTimingProps> = ({ timing, step, onClick }) => {
  const { submissionOpen, votingOpen, votingClose } = timing;
  const timingOptionForSubmissionPeriod = useTimingOptionForSubmissionPeriod(state => state.timingOption);
  const timingOptionForVotingPeriod = useTimingOptionForVotingPeriod(state => state.timingOption);

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
        return `open to enter for one day: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.TwoDays:
        return `open to enter for two days: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.ThreeDays:
        return `open to enter for three days: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneHour:
        return `open to enter for one hour: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneWeek:
        return `open to enter for one week: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneMonth:
        return `open to enter for one month: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      default:
        return `open to enter: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
    }
  }, [formattedSubmissionOpen, formattedVoteOpen, timingOptionForSubmissionPeriod]);

  const formatVotingPeriod = useMemo<string>(() => {
    const timingOption = timingOptionForVotingPeriod.value as TimingPeriod;

    switch (timingOption) {
      case TimingPeriod.OneDay:
        return `open to vote for one day: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.TwoDays:
        return `open to vote for two days: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.ThreeDays:
        return `open to vote for three days: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneHour:
        return `open to vote for one hour: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneWeek:
        return `open to vote for one week: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneMonth:
        return `open to vote for one month: ${formattedVoteOpen} to ${formattedVotesClose}`;
      default:
        return `open to vote: ${formattedVoteOpen} to ${formattedVotesClose}`;
    }
  }, [formattedVotesClose, formattedVoteOpen, timingOptionForVotingPeriod]);

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2">
        <p className="text-neutral-9 text-[12px] font-bold uppercase">timing</p>
        <ul className="flex flex-col pl-6 list-disc">
          <li className="text-[16px] text-neutral-11">{formatSubmissionPeriod}</li>
          <li className="text-[16px] text-neutral-11">{formatVotingPeriod}</li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmTiming;
