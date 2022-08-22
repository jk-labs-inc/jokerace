import create from "zustand";
import createContext from "zustand/context"
import Router from "next/router"
import { ROUTE_CREATE_CONTEST } from "@config/routes";
import type { Chain } from "wagmi";
import type { DataStep2 } from "./Step2/schema"
import type { DataStep3 } from "./Step3/schema"

export const { Provider, useStore } = createContext();

const stepsIndex = {
  2: 'stepTwo',
  3: 'stepThree',
};

export type WizardFormStep = 1 | 2 | 3 | 4;
export type setStepDataType =
  | { step: 2; data: DataStep2 }
  | { step: 3; data: DataStep3 };

export interface WizardFormState {
  // chain on which we're gonna create the token
  tokenDeployedToChain: null | Chain
  setTokenDeployedToChain: (chain: null | Chain) => void;
  
  // chain on which we're gonna create the contest 
  contestDeployedToChain: null | Chain
  setContestDeployedToChain: (chain: null | Chain) => void;

  // Steps
  currentStep: WizardFormStep,
  stepTwo: DataStep2 | null;
  stepThree: DataStep3 | null;
  setStepData: ({ step, data }: setStepDataType) => void;
  setCurrentStep: (stepNumber: WizardFormStep) => void;

  // Deploy token
  modalDeployTokenOpen: boolean
  modalDeploySubmissionTokenOpen: boolean,
  dataDeploySubmissionToken: any,
  dataDeployVotingToken: any,
  setModalDeploySubmissionTokenOpen:   (isOpen: boolean) => void;
  setDeploySubmissionTokenData: (data: any) => void
  setDeployVotingTokenData: (data: any) => void
  setModalDeployTokenOpen: (isOpen: boolean) => void;
  setDeployTokenData: (data: any) => void;
  
  // Deploy contest
  modalDeployContestOpen: boolean
  dataDeployContest: null
  setDeployContestData: (data: any) => void
  setModalDeployContestOpen: (isOpen: boolean) => void;
}

export const createStore = () => {
  return create<WizardFormState>((set) => ({
    tokenDeployedToChain: null,
    setTokenDeployedToChain: (chain) => set({ tokenDeployedToChain: chain }),
    setDeployTokenData: (data) => set({
      dataDeployVotingToken: data,
      dataDeploySubmissionToken: data,
    }),

    contestDeployedToChain: null,
    setContestDeployedToChain: (chain) => set({ contestDeployedToChain: chain }),

    currentStep: 1,
    setCurrentStep: (newStep) => set(() => {
      const newUrl = `${ROUTE_CREATE_CONTEST}?step=${newStep}`
      Router.push(newUrl, newUrl, {
        shallow: true
      })
      return ({ currentStep: newStep, modalDeployTokenOpen: false, modalDeployContestOpen: false })}),    
    stepTwo: null,
    stepThree: null,
    setStepData: ({ step, data }) =>
    set((state) => ({
      ...state,
      [stepsIndex[step]]: data,
    })),

    modalDeployTokenOpen: false,
    setModalDeployTokenOpen:  (value) => set({ modalDeployTokenOpen: value }),

    dataDeploySubmissionToken: null, 
    setDeploySubmissionTokenData: (value) => set({ dataDeploySubmissionToken: value }),
    setModalDeploySubmissionTokenOpen:  (value) => set({ modalDeploySubmissionTokenOpen: value }),
    modalDeploySubmissionTokenOpen: false,

    dataDeployVotingToken: null, 
    setDeployVotingTokenData: (value) => set({ dataDeployVotingToken: value }),

    dataDeployContest: null, 
    setDeployContestData: (value) => set({ dataDeployContest: value }),
    modalDeployContestOpen: false,
    setModalDeployContestOpen:  (value) => set({ modalDeployContestOpen: value }),
}))}
