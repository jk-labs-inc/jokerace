import { Abi } from "viem";
import { create } from "zustand";

interface EntryContractConfigStore {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
  contestVersion: string;
  proposalId: string;
  setContestAddress: (address: string) => void;
  setContestChainId: (chainId: number) => void;
  setContestAbi: (abi: Abi) => void;
  setContestVersion: (version: string) => void;
  setProposalId: (proposalId: string) => void;
}

export const useEntryContractConfigStore = create<EntryContractConfigStore>(set => ({
  contestAddress: "",
  contestChainId: 0,
  contestAbi: [],
  contestVersion: "",
  proposalId: "",
  setContestAddress: (address: string) => set({ contestAddress: address }),
  setContestChainId: (chainId: number) => set({ contestChainId: chainId }),
  setContestAbi: (abi: Abi) => set({ contestAbi: abi }),
  setContestVersion: (version: string) => set({ contestVersion: version }),
  setProposalId: (proposalId: string) => set({ proposalId: proposalId }),
}));
