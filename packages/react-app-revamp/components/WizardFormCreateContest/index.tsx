import { useStore } from "./store";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import type { WizardFormStep } from './store'
import StepIndicator from "./StepIndicator";

function renderStep(step: WizardFormStep) {
    switch(step) {
        case 1:
            return (
              <Step1 />
            );
          case 2:
            return (
              <Step2 />
            );
          case 3:
            return (
              <Step3 />
            );
            case 4:
              return (
                <Step4 />
              );
    }
  }
export const WizardFormCreateContest = () => {
    const state = useStore();
    return <>
        <StepIndicator />
        <div className="w-full md:w-3/4">
        { renderStep(state.currentStep)}
        </div>
    </>
}

export default WizardFormCreateContest