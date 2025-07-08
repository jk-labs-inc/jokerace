import { create } from "zustand";

interface DescriptionExpansionStore {
  expansionKey: number;
  triggerRecalculation: () => void;
}

export const useDescriptionExpansionStore = create<DescriptionExpansionStore>(set => ({
  expansionKey: 0,
  triggerRecalculation: () => set(state => ({ expansionKey: state.expansionKey + 1 })),
}));
