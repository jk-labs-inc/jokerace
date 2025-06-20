import { ContestType } from "@components/_pages/Create/types";

export type Prompt = {
  summarize: string;
  evaluateVoters: string;
  contactDetails?: string;
  imageUrl?: string;
};

export interface ContestInfoSliceState {
  title: string;
  prompt: Prompt;
  contestType: ContestType;
  emailSubscriptionAddress: string;
}

export interface ContestInfoSliceActions {
  setTitle: (title: string) => void;
  setPrompt: (prompt: Prompt) => void;
  setContestType: (contestType: ContestType) => void;
  setEmailSubscriptionAddress: (emailSubscriptionAddress: string) => void;
}

export type ContestInfoSlice = ContestInfoSliceState & ContestInfoSliceActions;

export const createContestInfoSlice = (set: any): ContestInfoSlice => ({
  title: "",
  prompt: {
    summarize: "",
    evaluateVoters: "Voters should evaluate based on 50% relevance to the prompt and 50% originality.",
    contactDetails: "Join the JokeRace telegram: https://t.co/j7Fp3u7pqS.",
  },
  contestType: ContestType.AnyoneCanPlay,
  emailSubscriptionAddress: "",
  
  setTitle: (title: string) => set({ title }),
  setPrompt: (prompt: Prompt) => set({ prompt }),
  setContestType: (contestType: ContestType) => set({ contestType }),
  setEmailSubscriptionAddress: (emailSubscriptionAddress: string) => set({ emailSubscriptionAddress }),
});