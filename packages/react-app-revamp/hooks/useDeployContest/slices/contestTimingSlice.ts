import moment from "moment-timezone";

export interface ContestTimingSliceState {
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
}

export interface ContestTimingSliceActions {
  setSubmissionOpen: (submissionOpen: Date) => void;
  setVotingOpen: (votingOpen: Date) => void;
  setVotingClose: (votingClose: Date) => void;
}

export type ContestTimingSlice = ContestTimingSliceState & ContestTimingSliceActions;

export const createContestTimingSlice = (set: any): ContestTimingSlice => {
  const initialSubmissionOpen: Date = moment().toDate();

  // Voting opens defaults to 1 week from now at 12:00pm ET (converted to local time)
  const initialVotingOpen: Date = moment
    .tz("America/New_York")
    .add(7, "days")
    .hour(12)
    .minute(0)
    .second(0)
    .millisecond(0)
    .local() // Convert ET to local time
    .toDate();

  // Voting closes defaults to 2 hours after voting opens
  const initialVotingClose: Date = moment(initialVotingOpen).add(2, "hours").toDate();

  return {
    submissionOpen: initialSubmissionOpen,
    votingOpen: initialVotingOpen,
    votingClose: initialVotingClose,

    setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
    setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
    setVotingClose: (votingClose: Date) => set({ votingClose }),
  };
};
