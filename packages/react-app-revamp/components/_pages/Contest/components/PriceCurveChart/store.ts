import { create } from "zustand";

interface PriceCurveChartStore {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

const usePriceCurveChartStore = create<PriceCurveChartStore>((set) => ({
  isExpanded: false,
  setIsExpanded: (isExpanded: boolean) => set({ isExpanded }),
}));

export default usePriceCurveChartStore;