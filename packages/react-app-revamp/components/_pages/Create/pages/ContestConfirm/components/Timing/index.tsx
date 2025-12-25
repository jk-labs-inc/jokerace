import moment from "moment-timezone";
import { FC } from "react";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmTimingProps {
  timing: {
    votingOpen: Date;
    votingClose: Date;
  };
  step: number;
  onClick?: (stepIndex: number) => void;
}

const CreateContestConfirmTiming: FC<CreateContestConfirmTimingProps> = ({ timing, step, onClick }) => {
  const { votingOpen, votingClose } = timing;
  const timezone = moment.tz.guess();
  const zoneAbbr = moment.tz(timezone).zoneAbbr();

  const formattedVoteOpen = `${moment(votingOpen).format("h:mma")} ${zoneAbbr} on ${moment(votingOpen).format(
    "MMMM D",
  )}`;
  const formattedVotesClose = `${moment(votingClose).format("h:mma")} ${zoneAbbr} on ${moment(votingClose).format(
    "MMMM D",
  )}`;

  const formatVotingPeriod = `Voting runs from ${formattedVoteOpen} to ${formattedVotesClose}.`;

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2">
        <p className="text-neutral-9 text-[12px] font-bold uppercase">timing</p>
        <ul className="flex flex-col pl-6 list-disc">
          <li className="text-[16px] text-neutral-11">{formatVotingPeriod}</li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmTiming;
