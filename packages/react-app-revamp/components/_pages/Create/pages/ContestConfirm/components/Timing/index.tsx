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
        return `submissions run one day: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneHour:
        return `submissions run one hour: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneWeek:
        return `submissions run one week: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      case TimingPeriod.OneMonth:
        return `submissions run one month: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
      default:
        return `submissions runs ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
    }
  }, [formattedSubmissionOpen, formattedVoteOpen, timingOptionForSubmissionPeriod]);

  const formatVotingPeriod = useMemo<string>(() => {
    const timingOption = timingOptionForVotingPeriod.value as TimingPeriod;

    switch (timingOption) {
      case TimingPeriod.OneDay:
        return `voting runs one day: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneHour:
        return `voting runs one hour: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneWeek:
        return `voting runs one week: ${formattedVoteOpen} to ${formattedVotesClose}`;
      case TimingPeriod.OneMonth:
        return `voting runs one month: ${formattedVoteOpen} to ${formattedVotesClose}`;
      default:
        return `voting runs ${formattedVoteOpen} to ${formattedVotesClose}`;
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
