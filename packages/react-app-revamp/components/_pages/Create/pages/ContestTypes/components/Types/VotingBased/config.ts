import { TimingPeriod } from "@components/_pages/Create/pages/ContestTiming/utils";
import { ContestTypeConfig } from "@components/_pages/Create/types";
import moment from "moment";

const votingBasedConfig: ContestTypeConfig = {
  data: {
    prompt: {
      evaluateVoters: "Voters should evaluate based on 50% relevance to the prompt and 50% originality.",
      contactDetails: "Join the JokeRace telegram: https://t.co/j7Fp3u7pqS.",
      summarize: "",
    },
    submissionOpen: new Date(),
    votingOpen: moment().add(1, "day").toDate(),
    votingClose: moment().add(1, "day").add(7, "days").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
    votingClosePeriod: {
      value: TimingPeriod.OneWeek,
      label: "one week",
    },
    votingAllowlist: {
      csv: {},
      prefilled: {},
    },
    votingMerkle: {
      csv: null,
      prefilled: null,
    },
  },
};

export default votingBasedConfig;
