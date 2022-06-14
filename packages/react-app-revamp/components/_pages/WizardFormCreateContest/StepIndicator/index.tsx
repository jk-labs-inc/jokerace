import shallow from "zustand/shallow";
import { Disclosure, Transition } from "@headlessui/react";
import { useStore } from "../store";
import styles from "./styles.module.css";

export const stepsNames = {
  [1]: {
    key: "rev-engines",
    label: "Rev engines",
  },
  [2]: {
    key: "mint-tokens",
    label: "Mint token",
  },
  [3]: {
    key: "set-rules",
    label: "Set rules",
  },
  [4]: {
    key: "airdrop",
    label: "Airdrop",
  },
};

const stepsNumber = Object.keys(stepsNames).length;
export const StepIndicator = () => {
  const { currentStep, setCurrentStep } = useStore(
    state => ({
      //@ts-ignore
      currentStep: state.currentStep,
      //@ts-ignore
      setCurrentStep: state.setCurrentStep,
    }),
    shallow,
  );

  return (
    <div className="pb-5">
      <ul className={`${styles.stepperDesktop} hidden sm:flex justify-between items-center text-sm`}>
        {Object.keys(stepsNames).map((indicator: any) => {
          return (
            <li
              className={`grow flex items-center 
            ${
              currentStep === parseInt(indicator)
                ? "text-primary-10 font-bold"
                : currentStep > parseInt(indicator)
                ? "text-primary-8"
                : "text-true-white"
            }`}
              //@ts-ignore
              key={`desktop-wizardform-step-${stepsNames[indicator].key}`}
            >
              {/* @ts-ignore*/}
              <button className="flex" onClick={() => setCurrentStep(parseInt(indicator))}>
                <span className="px-2 text-sm flex items-center justify-center mie-1ex aspect-square rounded-full border-solid border-current border">
                  {indicator}
                </span>
                {/* @ts-ignore*/}
                {stepsNames[indicator].label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="overflow-hidden rounded-md border border-solid border-primary-4 sm:hidden">
        <Disclosure>
          <Disclosure.Button className="bg-primary-1 bg-opacity-25 w-full block pt-1 pb-2 px-3">
            <span className="text-start text-primary-6 text-2xs block">
              Step{" "}
              <span className="pis-1ex">
                {currentStep} / {stepsNumber}
              </span>
            </span>
            {/* @ts-ignore */}
            <div className="flex font-bold items-center text-primary-10">{stepsNames[currentStep].label}</div>
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>
              <ul
                style={{
                  // @ts-ignore
                  "--stepperLineIndicatorHeight": `${
                    currentStep === 1 ? 0 : (currentStep / stepsNumber) * 100 - stepsNumber * 2.75
                  }%`,
                }}
                className={`${styles.stepperMobile} before:top-1 before:inline-start-1.5 before:translate-x-1/2 relative flex mx-3 pb-3 mt-3 space-y-4 flex-col`}
              >
                {Object.keys(stepsNames).map((indicator: any) => {
                  return (
                    //@ts-ignore
                    <li key={`mobile-wizard-form-step-${stepsNames[indicator].key}`}>
                      <Disclosure.Button
                        className={`grow w-full flex font-bold items-center text-xs ${
                          currentStep === parseInt(indicator)
                            ? "text-primary-10"
                            : currentStep > parseInt(indicator)
                            ? "text-primary-8"
                            : "text-true-white"
                        }`}
                        //@ts-ignore
                        onClick={() => setCurrentStep(parseInt(indicator))}
                      >
                        <span className="px-1 bg-true-black text-2xs flex items-center justify-center mie-1ex aspect-square rounded-full border-solid border-current border">
                          {indicator}
                        </span>
                        {/* @ts-ignore */}
                        {stepsNames[indicator].label}
                      </Disclosure.Button>
                    </li>
                  );
                })}
              </ul>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      </div>
    </div>
  );
};

export default StepIndicator;
