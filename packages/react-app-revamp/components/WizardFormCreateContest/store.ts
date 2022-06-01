import create from "zustand";
import createContext from "zustand/context";
import type { DataStep2 } from "./Step2/useForm"

export const { Provider, useStore } = createContext();

const stepsIndex = {
  2: 'stepTwo',
  3: 'stepThree',
};

export type WizardFormStep = 1 | 2 | 3 | 4;
export type WizardFormStepThreeData = null
export type setStepDataType =
  | { step: 2; data: DataStep2 }
  | { step: 3; data: WizardFormStepThreeData };

export interface WizardFormState {
  currentStep: WizardFormStep,
  stepTwo: DataStep2 | null;
  stepThree: WizardFormStepThreeData | null;
  setStepData: ({ step, data }: setStepDataType) => void;
  setCurrentStep: (stepNumber: WizardFormStep) => void;
}

export const createStore = () =>
  create<WizardFormState>((set) => ({
    currentStep: 1,
    stepTwo: null,
    stepThree: null,
    setCurrentStep: (newStep) => set((state) => ({ currentStep: newStep })),
    setStepData: ({ step, data }) =>
    set((state) => ({
      ...state,
      [stepsIndex[step]]: data,
    })),
}))