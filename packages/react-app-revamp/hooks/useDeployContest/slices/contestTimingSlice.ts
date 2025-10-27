import moment from "moment-timezone";
import { TimingDetails, createDateFromTiming, convertDateToTimingDetails } from "./helpers/dateHelpers";
import {
  generateVotingOpenMonthOptions,
  generateVotingOpenDayOptions,
  generateHourOptions,
  generateVotingCloseMonthOptions,
  generateVotingCloseDayOptions,
} from "./helpers/optionGenerators";

export enum Period {
  AM = "AM",
  PM = "PM",
}

export interface TimingOption {
  label: string;
  value: string;
}

export interface ContestTimingSliceState {
  submissionOpen: Date;
  votingOpen: TimingDetails;
  votingClose: TimingDetails;
}

export interface ContestTimingSliceActions {
  setSubmissionOpen: (submissionOpen: Date) => void;
  updateVotingOpen: (updates: Partial<TimingDetails>) => void;
  updateVotingClose: (updates: Partial<TimingDetails>) => void;
  setVotingOpen: (date: Date) => void;
  setVotingClose: (date: Date) => void;
  getVotingOpenDate: () => Date;
  getVotingCloseDate: () => Date;
  getVotingOpenMonthOptions: () => TimingOption[];
  getVotingOpenDayOptions: () => TimingOption[];
  getVotingOpenHourOptions: () => TimingOption[];
  getVotingCloseMonthOptions: () => TimingOption[];
  getVotingCloseDayOptions: () => TimingOption[];
  getVotingCloseHourOptions: () => TimingOption[];
  validateTiming: () => { isValid: boolean; error: string | null };
}

export type ContestTimingSlice = ContestTimingSliceState & ContestTimingSliceActions;

export const createContestTimingSlice = (set: any, get: any): ContestTimingSlice => {
  const initialSubmissionOpen: Date = moment().toDate();

  // Voting opens defaults to 1 week from now at 12:00pm ET
  const initialVotingOpenDate = moment
    .tz("America/New_York")
    .add(7, "days")
    .hour(12)
    .minute(0)
    .second(0)
    .millisecond(0)
    .local();

  const initialVotingOpen: TimingDetails = convertDateToTimingDetails(initialVotingOpenDate.toDate());

  // Voting closes defaults to 2 hours after voting opens
  const initialVotingCloseDate = initialVotingOpenDate.clone().add(2, "hours");
  const initialVotingClose: TimingDetails = convertDateToTimingDetails(initialVotingCloseDate.toDate());

  return {
    submissionOpen: initialSubmissionOpen,
    votingOpen: initialVotingOpen,
    votingClose: initialVotingClose,

    setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),

    updateVotingOpen: (updates: Partial<TimingDetails>) => {
      const state = get();
      const newVotingOpen = { ...state.votingOpen, ...updates };

      // If month changed, validate the day is still available
      if (updates.month !== undefined && updates.month !== state.votingOpen.month) {
        const availableDays = generateVotingOpenDayOptions(updates.month);
        const currentDayIsValid = availableDays.some(d => parseInt(d.value) === newVotingOpen.day);

        // If current day is not available, set to first available day
        if (!currentDayIsValid && availableDays.length > 0) {
          newVotingOpen.day = parseInt(availableDays[0].value);
        }
      }

      set({ votingOpen: newVotingOpen });
    },

    updateVotingClose: (updates: Partial<TimingDetails>) => {
      const state = get();
      const newVotingClose = { ...state.votingClose, ...updates };

      // If month changed, validate the day is still available
      if (updates.month !== undefined && updates.month !== state.votingClose.month) {
        const availableDays = generateVotingCloseDayOptions(state.votingOpen, updates.month);
        const currentDayIsValid = availableDays.some(d => parseInt(d.value) === newVotingClose.day);

        // If current day is not available, set to first available day
        if (!currentDayIsValid && availableDays.length > 0) {
          newVotingClose.day = parseInt(availableDays[0].value);
        }
      }

      set({ votingClose: newVotingClose });
    },

    setVotingOpen: (date: Date) => {
      const timingDetails = convertDateToTimingDetails(date);
      set({ votingOpen: timingDetails });
    },

    setVotingClose: (date: Date) => {
      const timingDetails = convertDateToTimingDetails(date);
      set({ votingClose: timingDetails });
    },

    getVotingOpenDate: () => {
      const state = get();
      return createDateFromTiming(state.votingOpen);
    },

    getVotingCloseDate: () => {
      const state = get();
      return createDateFromTiming(state.votingClose);
    },

    getVotingOpenMonthOptions: () => generateVotingOpenMonthOptions(),

    getVotingOpenDayOptions: () => {
      const state = get();
      return generateVotingOpenDayOptions(state.votingOpen.month);
    },

    getVotingOpenHourOptions: () => generateHourOptions(),

    getVotingCloseMonthOptions: () => {
      const state = get();
      return generateVotingCloseMonthOptions(state.votingOpen);
    },

    getVotingCloseDayOptions: () => {
      const state = get();
      return generateVotingCloseDayOptions(state.votingOpen, state.votingClose.month);
    },

    getVotingCloseHourOptions: () => generateHourOptions(),

    validateTiming: () => {
      const state = get();
      const votingOpenDate = createDateFromTiming(state.votingOpen);
      const votingCloseDate = createDateFromTiming(state.votingClose);
      const now = new Date();

      if (votingOpenDate <= now) {
        return {
          isValid: false,
          error: "Voting open time must be in the future",
        };
      }

      if (votingCloseDate <= votingOpenDate) {
        return {
          isValid: false,
          error: "Voting close must be after voting open",
        };
      }

      const durationMs = votingCloseDate.getTime() - votingOpenDate.getTime();
      const minDurationMs = 30 * 60 * 1000; // 30 minutes
      if (durationMs < minDurationMs) {
        return {
          isValid: false,
          error: "Voting period must be at least 30 minutes",
        };
      }

      // Check maximum voting duration (24 hours based on current limit)
      const maxDurationMs = 24 * 60 * 60 * 1000; // 24 hours
      if (durationMs > maxDurationMs) {
        return {
          isValid: false,
          error: "Voting period must be under 24 hours",
        };
      }

      return { isValid: true, error: null };
    },
  };
};
