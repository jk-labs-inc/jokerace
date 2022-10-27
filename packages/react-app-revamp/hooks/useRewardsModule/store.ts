import create from "zustand";
import createContext from "zustand/context";

export const { Provider, useStore } = createContext();

export const createStore = () => {
  return create(set => ({
    isLoadingModule: true,
    isLoadingModuleError: null,
    isLoadingModuleSuccess: false,
    rewardsModule: {},
    setIsLoadingModule: (isLoading: boolean) => set({ isLoadingModule: isLoading }),
    setIsLoadingModuleError: (value: string | null) => set({ isLoadingModuleError: value }),
    setIsLoadingModuleSuccess: (value: boolean) => set({ isLoadingModuleSuccess: value }),
    setRewardsModule: (rewardsModule: any) => set({ rewardsModule }),
  }));
};
