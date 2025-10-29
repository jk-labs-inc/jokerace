import { ContestTypeConfig } from "@components/_pages/Create/types";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import moment from "moment-timezone";

export const anyoneCanPlayConfig: ContestTypeConfig = {
  data: {
    submissionOpen: moment().toDate(),
    votingOpen: moment
      .tz("America/New_York")
      .add(7, "days")
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0)
      .local()
      .toDate(),
    votingClose: moment
      .tz("America/New_York")
      .add(7, "days")
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0)
      .add(2, "hours")
      .local()
      .toDate(),
    priceCurve: {
      type: PriceCurveType.Exponential,
      multiple: 1,
    },
  },
};
