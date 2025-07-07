import moment from "moment";

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
  const initialSubmissionOpen: Date = new Date();
  const initialVotingOpen: Date = moment().add(7, "days").toDate();
  const initialVotingClose: Date = moment().add(7, "days").add(3, "days").toDate();

  return {
    submissionOpen: initialSubmissionOpen,
    votingOpen: initialVotingOpen,
    votingClose: initialVotingClose,

    setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
    setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
    setVotingClose: (votingClose: Date) => set({ votingClose }),
  };
};