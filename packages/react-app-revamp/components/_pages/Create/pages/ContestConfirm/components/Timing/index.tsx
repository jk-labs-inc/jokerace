import moment from "moment-timezone";
import { FC } from "react";
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
  const timezone = moment.tz.guess();

  const formattedSubmissionOpen = `${moment(submissionOpen).format("MMMM D, YYYY h:mmA")} ${moment
    .tz(timezone)
    .zoneAbbr()}`;
  const formattedVoteOpen = `${moment(votingOpen).format("MMMM D, YYYY h:mmA")} ${moment.tz(timezone).zoneAbbr()}`;
  const formattedVotesClose = `${moment(votingClose).format("MMMM D, YYYY h:mmA")} ${moment.tz(timezone).zoneAbbr()}`;

  const formatSubmissionPeriod = `open to enter: ${formattedSubmissionOpen} to ${formattedVoteOpen}`;
  const formatVotingPeriod = `open to vote: ${formattedVoteOpen} to ${formattedVotesClose}`;

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
