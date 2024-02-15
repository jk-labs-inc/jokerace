import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";

const CreateContestConfirm = () => {
  const { step } = useDeployContestStore(state => state);
  return (
    <div className="mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-10 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-4">
          <p className="text-[24px] text-primary-10 font-bold">finally, let’s confirm</p>
        </div>
      </div>
    </div>
  );
};

export default CreateContestConfirm;
