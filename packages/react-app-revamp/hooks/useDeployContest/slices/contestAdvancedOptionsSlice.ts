export type AdvancedOptions = {
  sorting: boolean;
  rankLimit: number;
};

export interface AdvancedOptionsSliceState {
  advancedOptions: AdvancedOptions;
}

export interface AdvancedOptionsSliceActions {
  setAdvancedOptions: (advancedOptions: AdvancedOptions) => void;
}

export type AdvancedOptionsSlice = AdvancedOptionsSliceState & AdvancedOptionsSliceActions;

export const createAdvancedOptionsSlice = (set: any): AdvancedOptionsSlice => ({
  advancedOptions: {
    sorting: true,
    rankLimit: 250,
  },

  setAdvancedOptions: (advancedOptions: AdvancedOptions) => set({ advancedOptions }),
});