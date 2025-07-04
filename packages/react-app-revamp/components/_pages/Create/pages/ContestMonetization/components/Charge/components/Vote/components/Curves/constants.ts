import { PriceCurveType } from "@hooks/useDeployContest/types";

export const PRICE_CURVE_LABELS = {
  [PriceCurveType.Flat]: "a fixed charge throughout the contest",
  [PriceCurveType.Exponential]: {
    desktop: "charge increases throughout contest to incentivize participation",
    mobile: "charge increases throughout contest",
  },
} as const;
