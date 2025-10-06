import { createContext, useContext, useState } from "react";
import { createStore, useStore } from "zustand";

interface ProposalIdStoreState {
  proposalId: string;
  setProposalId: (proposalId: string) => void;
}

type ProposalIdStoreApi = ReturnType<typeof createProposalIdStore>;

const createProposalIdStore = (initialProposalId: string) => {
  return createStore<ProposalIdStoreState>(set => ({
    proposalId: initialProposalId,
    setProposalId: (proposalId: string) => set({ proposalId }),
  }));
};

const ProposalIdStoreContext = createContext<ProposalIdStoreApi | null>(null);

export const ProposalIdStoreProvider = ({
  children,
  proposalId,
}: {
  children: React.ReactNode;
  proposalId: string;
}) => {
  const [store] = useState(() => createProposalIdStore(proposalId));

  return <ProposalIdStoreContext.Provider value={store}>{children}</ProposalIdStoreContext.Provider>;
};

const useProposalIdStore = <T,>(selector: (state: ProposalIdStoreState) => T): T => {
  const store = useContext(ProposalIdStoreContext);
  if (!store) {
    throw new Error("Missing ProposalIdStoreProvider");
  }
  return useStore(store, selector);
};

export default useProposalIdStore;
