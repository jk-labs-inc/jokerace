import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import CreateNextButton from "../../components/Buttons/Next";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";
import CreateContestCharge from "./components/Charge";

const CreateContestMonetization = () => {
  const { step, charge } = useDeployContestStore(state => state);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const [disableNextStep, setDisableNextStep] = useState(false);
  const monetizationValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => monetizationValidation?.[0].validation(charge)]);

  return (
    <div className="mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-10 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <p className="text-[24px] text-primary-10 font-bold">let’s monetize this puppy</p>
          </div>
          <CreateContestCharge
            isConnected={isConnected}
            chain={chain?.name.toLowerCase() ?? ""}
            onError={value => setDisableNextStep(value)}
          />
          <div className="mt-2">
            <CreateNextButton step={step + 1} isDisabled={disableNextStep} onClick={onNextStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestMonetization;
