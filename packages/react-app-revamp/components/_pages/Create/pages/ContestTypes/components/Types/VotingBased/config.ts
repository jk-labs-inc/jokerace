import { TimingPeriod } from "@components/_pages/Create/pages/ContestTiming/utils";
import { ContestTypeConfig } from "@components/_pages/Create/types";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import moment from "moment";

const votingBasedConfig: ContestTypeConfig = {
  data: {
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
    priceCurve: {
      type: PriceCurveType.Exponential,
      multiple: 1,
    },
  },
};

export default votingBasedConfig;
