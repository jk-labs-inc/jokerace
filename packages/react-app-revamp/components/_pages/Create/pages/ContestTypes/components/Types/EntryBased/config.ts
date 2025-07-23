import { TimingPeriod } from "@components/_pages/Create/pages/ContestTiming/utils";
import { ContestTypeConfig } from "@components/_pages/Create/types";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import moment from "moment";

const entryBasedConfig: ContestTypeConfig = {
  data: {
    submissionOpen: new Date(),
    votingOpen: moment().add(7, "days").toDate(),
    votingClose: moment().add(7, "days").add(1, "day").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneWeek,
      label: "one week",
    },
    votingClosePeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
    votingAllowlist: {
      csv: {},
      prefilled: {},
    },
    votingMerkle: {
      csv: null,
      prefilled: null,
    },
    priceCurve: {
      type: PriceCurveType.Flat,
      multiple: 1,
    },
  },
};

export default entryBasedConfig;
