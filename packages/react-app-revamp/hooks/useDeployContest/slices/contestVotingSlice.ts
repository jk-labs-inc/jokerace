import { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { VotingRequirements, VotingMerkle } from "../types";

export type MerkleKey = "prefilled" | "csv";

export interface VotingSliceState {
  votingRequirements: VotingRequirements;
  votingRequirementsOption: Option;
  votingAllowlist: {
    csv: Record<string, number>;
    prefilled: Record<string, number>;
  };
  votingMerkle: {
    csv: VotingMerkle | null;
    prefilled: VotingMerkle | null;
  };
  votingTab: number;
}

export interface VotingSliceActions {
  setVotingRequirements: (votingRequirements: VotingRequirements) => void;
  setVotingRequirementsOption: (votingRequirementsOption: Option) => void;
  setVotingAllowlist: (type: MerkleKey, votingAllowlist: Record<string, number>) => void;
  setVotingMerkle: (type: MerkleKey, votingMerkle: VotingMerkle | null) => void;
  setVotingTab: (tab: number) => void;
}

export type VotingSlice = VotingSliceState & VotingSliceActions;

export const emptyVotingRequirements = {
  type: "erc20",
  nftType: "erc721",
  chain: "mainnet",
  tokenAddress: "",
  minTokensRequired: 0.01,
  powerType: "token",
  powerValue: 100,
  timestamp: Date.now(),
  name: "",
  symbol: "",
  logo: "",
  nftTokenId: "",
};

export const createVotingSlice = (set: any): VotingSlice => ({
  votingRequirements: emptyVotingRequirements,
  votingRequirementsOption: {
    value: "erc20",
    label: "token holders",
  },
  votingAllowlist: {
    csv: {},
    prefilled: {},
  },
  votingMerkle: {
    csv: null,
    prefilled: null,
  },
  votingTab: 0,

  setVotingRequirements: (votingRequirements: VotingRequirements) => set({ votingRequirements }),
  setVotingRequirementsOption: (votingRequirementsOption: Option) => set({ votingRequirementsOption }),
  setVotingAllowlist: (type: MerkleKey, votingAllowlist: Record<string, number>) => {
    set((state: any) => ({
      votingAllowlist: {
        ...state.votingAllowlist,
        [type]: votingAllowlist,
      },
    }));
  },
  setVotingMerkle: (type: MerkleKey, votingMerkle: VotingMerkle | null) => {
    set((state: any) => ({
      votingMerkle: {
        ...state.votingMerkle,
        [type]: votingMerkle,
      },
    }));
  },
  setVotingTab: (votingTab: number) => set({ votingTab }),
});
