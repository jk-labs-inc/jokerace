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
  const state = useStore();

  return (
    <div className="pb-5">
      <ul className={`${styles.stepperDesktop} hidden sm:flex justify-between items-center text-sm`}>
        {Object.keys(stepsNames).map(indicator => {
          return (
            <li
              className={`grow flex items-center 
            ${
              state.currentStep === parseInt(indicator)
                ? "text-primary-10 font-bold"
                : state.currentStep > parseInt(indicator)
                ? "text-primary-8"
                : "text-true-white"
            }`}
              key={`desktop-wizardform-step-${stepsNames[indicator].key}`}
            >
              <button className="flex" onClick={() => state.setCurrentStep(parseInt(indicator))}>
                <span className="px-2 text-sm flex items-center justify-center mie-1ex aspect-square rounded-full border-solid border-current border">
                  {indicator}
                </span>
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
                {state.currentStep} / {stepsNumber}
              </span>
            </span>
            <div className="flex font-bold items-center text-primary-10">{stepsNames[state.currentStep].label}</div>
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
                  "--stepperLineIndicatorHeight": `${
                    state.currentStep === 1 ? 0 : (state.currentStep / stepsNumber) * 100 - stepsNumber * 2.75
                  }%`,
                }}
                className={`${styles.stepperMobile} before:top-1 before:inline-start-1.5 before:translate-x-1/2 relative flex mx-3 pb-3 mt-3 space-y-4 flex-col`}
              >
                {Object.keys(stepsNames).map(indicator => {
                  return (
                    <li key={`mobile-wizard-form-step-${stepsNames[indicator].key}`}>
                      <Disclosure.Button
                        className={`grow w-full flex font-bold items-center text-xs ${
                          state.currentStep === parseInt(indicator)
                            ? "text-primary-10"
                            : state.currentStep > parseInt(indicator)
                            ? "text-primary-8"
                            : "text-true-white"
                        }`}
                        onClick={() => state.setCurrentStep(parseInt(indicator))}
                      >
                        <span className="px-1 bg-true-black text-2xs flex items-center justify-center mie-1ex aspect-square rounded-full border-solid border-current border">
                          {indicator}
                        </span>
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
