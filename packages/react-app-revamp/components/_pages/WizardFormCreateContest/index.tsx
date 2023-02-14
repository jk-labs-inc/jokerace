import shallow from 'zustand/shallow'
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useStore } from "./store";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import StepIndicator from "./StepIndicator";
import type { WizardFormStep } from './store'
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Transition } from "@headlessui/react";
import Loader from "@components/Loader";

let openedSteps: number[] = [];
function renderStep(step: WizardFormStep, urlParam: string | undefined) {
  const stepToRender = urlParam ? parseInt(urlParam) : step 

  // render on the first tab open only
  const isStepOpened = openedSteps.includes(stepToRender);
  if (!isStepOpened) {
    openedSteps.push(stepToRender);
  }

  return (
    <>
      <div className={stepToRender === 1 ? '' : 'hidden'}>
        {openedSteps.includes(1) &&
          <Step1 />
        }
      </div>
      <div className={stepToRender === 2 ? '' : 'hidden'}>
        {openedSteps.includes(2) &&
          <Step2 />
        }
      </div>
      <div className={stepToRender === 3 ? '' : 'hidden'}>
        {openedSteps.includes(3) &&
          <Step3 />
        }
      </div>
      <div className={stepToRender === 4 ? '' : 'hidden'}>
        {openedSteps.includes(4) &&
          <Step4 />
        }
      </div>
    </>
  );
}

export const WizardFormCreateContest = () => {
  const { currentStep, setCurrentStep } = useStore(state =>  ({ 
    //@ts-ignore
    currentStep: state.currentStep, 
    //@ts-ignore
    setCurrentStep: state.setCurrentStep, 
  }), shallow);
  
  const { query: { step }, isReady } = useRouter()
  const { isConnected, isConnecting, isReconnecting } = useAccount()
  const { chain } = useNetwork()

  useEffect(() => {
    //@ts-ignore
    if(isReady && step && parseInt(step) !== currentStep) setCurrentStep(parseInt(step))
  },[step, isReady])

  useEffect(() => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }, [currentStep])

  return <>
    <Transition 
      show={!isReady || isConnecting || isReconnecting}
      as={Fragment}
      enter="ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    
    >
      <div>
        <Loader scale="page" />
      </div>
    </Transition>

    <Transition
      show={isReady && !isConnecting && !isReconnecting}
      as={Fragment}
      enter="ease-out duration-300 delay-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 "
    >
<div>
    {(isReady && (!isConnected || chain?.unsupported === true)) && <div className='mb-5 text-sm font-bold flex items-center bg-primary-1 text-primary-10 p-3 rounded-md border-solid border border-primary-4'>
    <ExclamationCircleIcon className="w-6 mie-1ex" />
    {!isConnected ? "Connect your wallet to create your contest." : chain?.unsupported === true && "We don't support this chain (yet). In the meantime, please switch to another network."}
    </div>}
    <StepIndicator />
    <div className="w-full max-w-screen-md">
      {/* @ts-ignore */}
      {renderStep(currentStep, step)}
    </div>
  </div>
  </Transition>
</> 

}

export default WizardFormCreateContest