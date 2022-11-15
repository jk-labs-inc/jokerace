import create from "zustand";
import createContext from "zustand/context";

export const { Provider, useStore } = createContext();
export interface StoreRewardsModule {
  isLoadingModule: boolean,
  isLoadingModuleError: any,
  isLoadingModuleSuccess: boolean,
  rewardsModule: any,
  setIsLoadingModule: (isLoading: boolean) => void,
  setIsLoadingModuleError: (value: string | null) => void,
  setIsLoadingModuleSuccess: (value: boolean) => void,
  setRewardsModule: (rewardsModule: any) => void,
}

export const createStore = () => {
  return create<StoreRewardsModule>(set => ({
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
