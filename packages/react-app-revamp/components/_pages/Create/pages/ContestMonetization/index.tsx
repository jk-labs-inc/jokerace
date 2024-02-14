import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateContestCharge from "./components/Charge";
import { useAccount, useNetwork } from "wagmi";
import CreateNextButton from "../../components/Buttons/Next";

const CreateContestMonetization = () => {
  const { step } = useDeployContestStore(state => state);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <div className="mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-10 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <p className="text-[24px] text-primary-10 font-bold">let’s monetize this puppy</p>
          </div>
          <CreateContestCharge isConnected={isConnected} chain={chain?.name.toLowerCase() ?? ""} />
          <div className="mt-2">
            <CreateNextButton step={step + 1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestMonetization;
