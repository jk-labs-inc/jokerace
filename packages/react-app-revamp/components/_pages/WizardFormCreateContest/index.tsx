import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { useConnect, useNetwork } from "wagmi";
import { useStore } from "./store";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import StepIndicator from "./StepIndicator";
import type { WizardFormStep, WizardFormState } from './store'
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Transition } from "@headlessui/react";
import Loader from "@components/Loader";

function renderStep(step: WizardFormStep, urlParam: string | undefined) {
    const stepToRender = urlParam ? parseInt(urlParam) : step 
    switch(stepToRender) {
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
    //@ts-ignore
    const stateWizardForm: WizardFormState = useStore()
    const { query: { step }, isReady } = useRouter()
    const connect = useConnect()
    const { isConnected } = connect
    const { activeChain, isLoading } = useNetwork()

    useEffect(() => {
      //@ts-ignore
      if(isReady && step && parseInt(step) !== stateWizardForm.currentStep) stateWizardForm.setCurrentStep(parseInt(step))
    },[step, isReady])

    useEffect(() => {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }, [stateWizardForm.currentStep])

 return <>
   <Transition 
    show={!isReady || isLoading}
    as={Fragment}
    enter="ease-out duration-200"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    
   >
    <div>
      <Loader />
    </div>
   </Transition>
   <Transition
show={isReady && !isLoading}
as={Fragment}
enter="ease-out duration-300 delay-300"
enterFrom="opacity-0"
enterTo="opacity-100"
leave="ease-in duration-300"
leaveFrom="opacity-100"
leaveTo="opacity-0 "
>
<div>
    {(isReady && (!isConnected || activeChain?.unsupported === true)) && <div className='mb-5 text-sm font-bold flex items-center bg-primary-1 text-primary-10 p-3 rounded-md border-solid border border-primary-4'>
    <ExclamationCircleIcon className="w-6 mie-1ex" />
    {!isConnected ? "Connect your wallet to create your contest." : activeChain?.unsupported === true && "We don't support this chain (yet). In the meantime, please switch to another network."}
    </div>}
    <StepIndicator />
    <div className="w-full">
      {/* @ts-ignore */}
      {renderStep(stateWizardForm.currentStep, step)}
    </div>
  </div>
  </Transition>
 </> 

}

export default WizardFormCreateContest