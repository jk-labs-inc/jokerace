import { createContext, useContext, useState } from "react";
import { createStore, useStore } from "zustand";
import { ProposalStaticData, ContestVoteTimings } from "lib/submission";
import { ContestStateEnum } from "@hooks/useContestState/store";

interface SubmissionPageStoreState {
  proposalStaticData: ProposalStaticData | null;
  contestDetails: {
    author: string | null;
    name: string | null;
    state: ContestStateEnum | null;
  };
  allProposalIds: string[];
  voteTimings: ContestVoteTimings | null;
  setProposalStaticData: (data: ProposalStaticData | null) => void;
  setContestDetails: (details: { author: string | null; name: string | null; state: ContestStateEnum | null }) => void;
  setAllProposalIds: (ids: string[]) => void;
  setVoteTimings: (timings: ContestVoteTimings | null) => void;
}

type SubmissionPageStoreApi = ReturnType<typeof createSubmissionPageStore>;

const createSubmissionPageStore = (
  initialProposalData: ProposalStaticData | null,
  initialContestDetails: { author: string | null; name: string | null; state: ContestStateEnum | null },
  initialProposalIds: string[],
  initialVoteTimings: ContestVoteTimings | null,
) => {
  return createStore<SubmissionPageStoreState>(set => ({
    proposalStaticData: initialProposalData,
    contestDetails: initialContestDetails,
    allProposalIds: initialProposalIds,
    voteTimings: initialVoteTimings,
    setProposalStaticData: (data: ProposalStaticData | null) => set({ proposalStaticData: data }),
    setContestDetails: (details: { author: string | null; name: string | null; state: ContestStateEnum | null }) =>
      set({ contestDetails: details }),
    setAllProposalIds: (ids: string[]) => set({ allProposalIds: ids }),
    setVoteTimings: (timings: ContestVoteTimings | null) => set({ voteTimings: timings }),
  }));
};

const SubmissionPageStoreContext = createContext<SubmissionPageStoreApi | null>(null);

export const SubmissionPageStoreProvider = ({
  children,
  proposalStaticData,
  contestDetails,
  allProposalIds,
  voteTimings,
}: {
  children: React.ReactNode;
  proposalStaticData: ProposalStaticData | null;
  contestDetails: {
    author: string | null;
    name: string | null;
    state: ContestStateEnum | null;
  };
  allProposalIds: string[];
  voteTimings: ContestVoteTimings | null;
}) => {
  const [store] = useState(() =>
    createSubmissionPageStore(proposalStaticData, contestDetails, allProposalIds, voteTimings),
  );

  return <SubmissionPageStoreContext.Provider value={store}>{children}</SubmissionPageStoreContext.Provider>;
};

export const useSubmissionPageStore = <T,>(selector: (state: SubmissionPageStoreState) => T): T => {
  const store = useContext(SubmissionPageStoreContext);
  if (!store) {
    throw new Error("Missing SubmissionPageStoreProvider");
  }
  return useStore(store, selector);
};
