import { create } from "zustand";

interface EntryPreviewTitleToggleState {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

export const useEntryPreviewTitleToggleStore = create<EntryPreviewTitleToggleState>(set => ({
  isExpanded: false,
  setIsExpanded: (value: boolean) => set({ isExpanded: value }),
}));
