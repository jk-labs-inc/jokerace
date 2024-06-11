import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { CreationStep, useCreateRewardsStore } from "../../store";
import { useMediaQuery } from "react-responsive";

const CreateRewardsInitialStep = () => {
  const { setStep } = useCreateRewardsStore(state => state);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col gap-12 animate-reveal">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">let’s add rewards 💸💸💸</p>
        <p className="text-[16px] text-neutral-11">what’s a good contest without rewards?</p>
        <p className="text-[16px] text-neutral-11">
          add rewards to get more players, up the stakes, and give a better
          {isMobile ? " " : <br />}
          time for all.
        </p>
        <p className="text-[16px] text-neutral-11">for each option, we’ll create a rewards pool and then fund it.</p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 w-full md:w-[360px] h-48 pt-4 pb-6 pl-4 border-neutral-9 border rounded-[10px] hover:border-neutral-11 transition-colors duration-300">
          <p className="text-neutral-11 text-[20px] font-bold">reward winners</p>
          <p className="text-neutral-14 text-[16px]">
            create and fund a pool to distribute
            {isMobile ? " " : <br />}
            tokens proportionately to winners
          </p>
          <ButtonV3
            colorClass={`bg-gradient-vote text-[16px] rounded-[30px] font-bold text-true-black pb-2 pt-1`}
            size={ButtonSize.EXTRA_LARGE}
            onClick={() => setStep(CreationStep.CreatePool)}
          >
            create rewards pool
          </ButtonV3>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsInitialStep;
