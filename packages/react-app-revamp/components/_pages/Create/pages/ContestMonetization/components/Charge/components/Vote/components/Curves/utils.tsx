import { ReactNode } from "react";
import { PriceCurveType, PriceCurve } from "@hooks/useDeployContest/types";
import { RadioOption } from "@components/_pages/Create/components/RadioButtonsGroup";
import ExponentialPricingOption from "./components/ExponentialPricingOption";
import FlatPricingOption from "./components/FlatPricingOption";
import { PRICE_CURVE_LABELS } from "./constants";
import { PriceCurveContentProps, ExponentialPriceCurveContentProps } from "./types";

export const createFlatCurveContent = (props: PriceCurveContentProps, isActive: boolean): ReactNode => {
  if (!isActive) return null;

  return (
    <FlatPricingOption
      costToVote={props.costToVote}
      label={props.label}
      onPriceChange={props.onCostToVoteChange}
      errorMessage={props.errorMessage}
    />
  );
};

export const createExponentialCurveContent = (
  props: ExponentialPriceCurveContentProps,
  isActive: boolean,
): ReactNode => {
  if (!isActive) return null;

  return (
    <ExponentialPricingOption
      costToVote={props.costToVote}
      costToVoteEndPrice={props.costToVoteEndPrice}
      onCostToVoteEndPriceChange={props.onCostToVoteEndPriceChange}
      chainUnitLabel={props.label}
      errorMessage={props.errorMessage}
      onCostToVoteChange={props.onCostToVoteChange}
      onMultipleChange={props.onMultipleChange}
    />
  );
};

export const createCurveOptions = (
  priceCurve: PriceCurve,
  contentProps: PriceCurveContentProps,
  onMultipleChange: (value: number) => void,
): RadioOption[] => [
  {
    label: PRICE_CURVE_LABELS[PriceCurveType.Flat],
    value: PriceCurveType.Flat,
    content: createFlatCurveContent(contentProps, priceCurve.type === PriceCurveType.Flat),
  },
  {
    label: PRICE_CURVE_LABELS[PriceCurveType.Exponential].desktop,
    mobileLabel: PRICE_CURVE_LABELS[PriceCurveType.Exponential].mobile,
    value: PriceCurveType.Exponential,
    content: createExponentialCurveContent(
      {
        ...contentProps,
        onMultipleChange,
      },
      priceCurve.type === PriceCurveType.Exponential,
    ),
  },
];
