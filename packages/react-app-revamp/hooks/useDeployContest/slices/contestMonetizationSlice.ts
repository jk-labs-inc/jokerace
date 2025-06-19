import { 
  Charge, 
  PriceCurve, 
  PriceCurveType, 
  SplitFeeDestinationType, 
  VoteType 
} from "../types";

export interface MonetizationSliceState {
  charge: Charge;
  minCharge: {
    minCostToPropose: number;
    minCostToVote: number;
  };
  prevChainRefInCharge: string;
  priceCurve: PriceCurve;
}

export interface MonetizationSliceActions {
  setCharge: (charge: Charge) => void;
  setMinCharge: (minCharge: { minCostToPropose: number; minCostToVote: number; minCostToVoteEndPrice?: number }) => void;
  setPrevChainRefInCharge: (chain: string) => void;
  setPriceCurve: (priceCurve: PriceCurve) => void;
}

export type MonetizationSlice = MonetizationSliceState & MonetizationSliceActions;

export const createMonetizationSlice = (set: any): MonetizationSlice => ({
  charge: {
    percentageToCreator: 70,
    splitFeeDestination: { type: SplitFeeDestinationType.CreatorWallet, address: "" },
    voteType: VoteType.PerVote,
    type: {
      costToPropose: 0,
      costToVote: 0,
      costToVoteEndPrice: 0,
    },
    error: false,
  },
  minCharge: {
    minCostToPropose: 0,
    minCostToVote: 0,
  },
  prevChainRefInCharge: "",
  priceCurve: {
    type: PriceCurveType.Flat,
    multiple: 1,
  },

  setCharge: (charge: Charge) => set({ charge }),
  setMinCharge: (minCharge: { minCostToPropose: number; minCostToVote: number }) => set({ minCharge }),
  setPrevChainRefInCharge: (chain: string) => set({ prevChainRefInCharge: chain }),
  setPriceCurve: (priceCurve: PriceCurve) => set({ priceCurve }),
});