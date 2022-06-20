import create from "zustand";
import createContext from "zustand/context";

export const createStore = () => {
  return create(set => ({
    isListVotersSuccess: false,
    isListVotersError: null,
    isListVotersLoading: true,
    votesPerAddress: {},
    //@ts-ignore
    setVotesPerAddress: ({ address, value }) =>
      set(state => ({
        ...state,
        votesPerAddress: {
          //@ts-ignore
          ...state.votesPerAddress,
          [address]: value,
        },
      })),
    setIsListVotersLoading: (value: boolean) => set({ isListVotersLoading: value }),
    setIsListVotersSuccess: (value: boolean) => set({ isListVotersSuccess: value }),
    setIsListVotersError: (value: string | null) => set({ isListVotersError: value }),
  }));
};

export const { Provider, useStore } = createContext();
