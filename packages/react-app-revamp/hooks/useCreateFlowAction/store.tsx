import { create } from "zustand";

type PageAction = "create" | "play";

type PageActionState = {
  pageAction: PageAction;
  setPageAction: (pageAction: PageAction) => void;
  togglePageAction: () => void;
};

export const usePageActionStore = create<PageActionState>(set => ({
  pageAction: "create",
  setPageAction: pageAction => set({ pageAction }),
  togglePageAction: () =>
    set(state => ({
      pageAction: state.pageAction === "create" ? "play" : "create",
    })),
}));
