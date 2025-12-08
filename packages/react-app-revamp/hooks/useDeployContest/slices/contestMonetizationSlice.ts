import { PERCENTAGE_TO_CREATOR_DEFAULT } from "constants/monetization";
import { Charge, PriceCurve, PriceCurveType, VoteType } from "../types";

type ReactStyleStateSetter<T> = T | ((prev: T) => T);

export const DEFAULT_MULTIPLER = 10;

export interface MonetizationSliceState {
  charge: Charge;
  prevChainRefInCharge: string;
  priceCurve: PriceCurve;
}

export interface MonetizationSliceActions {
  setCharge: (charge: ReactStyleStateSetter<Charge>) => void;
  setPrevChainRefInCharge: (chain: string) => void;
  setPriceCurve: (priceCurve: ReactStyleStateSetter<PriceCurve>) => void;
}

export type MonetizationSlice = MonetizationSliceState & MonetizationSliceActions;

export const createMonetizationSlice = (set: any): MonetizationSlice => ({
  charge: {
    percentageToCreator: PERCENTAGE_TO_CREATOR_DEFAULT,
    voteType: VoteType.PerVote,
    type: {
      costToVote: 0,
      costToVoteStartPrice: 0,
      costToVoteEndPrice: 0,
    },
    error: false,
  },

  prevChainRefInCharge: "",
  priceCurve: {
    type: PriceCurveType.Exponential,
    multiple: 1,
    multipler: DEFAULT_MULTIPLER,
  },

  setCharge: (charge: ReactStyleStateSetter<Charge>) =>
    set((state: any) => ({
      charge: typeof charge === "function" ? charge(state.charge) : charge,
    })),
  setPrevChainRefInCharge: (chain: string) => set({ prevChainRefInCharge: chain }),
  setPriceCurve: (priceCurve: ReactStyleStateSetter<PriceCurve>) =>
    set((state: any) => ({
      priceCurve: typeof priceCurve === "function" ? priceCurve(state.priceCurve) : priceCurve,
    })),
});
