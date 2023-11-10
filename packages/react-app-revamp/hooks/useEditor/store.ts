import { create } from "zustand";

interface StoreState {
  revertTextOption: boolean;
  setRevertTextOption: (revertTextOption: boolean) => void;
}

export const useEditorStore = create<StoreState>(set => ({
  revertTextOption: false,
  setRevertTextOption: revertTextOption => set({ revertTextOption }),
}));
