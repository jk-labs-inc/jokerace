import { toastInfo } from "@components/UI/Toast";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useContestSteps } from "../../hooks/useContestSteps";
import { useNextStep } from "../../hooks/useNextStep";
import useSetContestTypeConfig from "../../hooks/useSetContestTypeConfig";
import { ContestType } from "../../types";
import CreateContestTypesAnyoneCanPlay from "./components/Types/AnyoneCanPlay";
import { anyoneCanPlayConfig } from "./components/Types/AnyoneCanPlay/config";
import CreateContestTypesEntryBased from "./components/Types/EntryBased";
import entryBasedConfig from "./components/Types/EntryBased/config";
import CreateContestTypesVotingBased from "./components/Types/VotingBased";
import votingBasedConfig from "./components/Types/VotingBased/config";
import { FOOTER_LINKS } from "@config/links";

const contestTypeConfigs = {
  [ContestType.AnyoneCanPlay]: anyoneCanPlayConfig,
  [ContestType.EntryContest]: entryBasedConfig,
  [ContestType.VotingContest]: votingBasedConfig,
} as const;

const CreateContestTypes = () => {
  const { steps } = useContestSteps();
  const { address } = useAccount();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { step, setContestType, contestType } = useDeployContestStore(state => state);
  const typeTitle = isMobile ? "what type of contest?" : "what kind of contest do you want to create?";
  const onNextStep = useNextStep();
  const setContestTypeConfig = useSetContestTypeConfig();
  const faqLink = FOOTER_LINKS.find(link => link.label === "FAQ")?.href;

  const handleTypeSelection = (type: ContestType) => {
    if (type === ContestType.VotingContest && !address) {
      toastInfo("please connect your wallet first");
      return;
    }

    setContestType(type);
    setContestTypeConfig(type, contestTypeConfigs[type]);
  };

  useEffect(() => {
    if (contestType) {
      setContestTypeConfig(contestType, contestTypeConfigs[contestType]);
    }
  }, []);

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="grid grid-cols-[var(--grid-full-width-create-flow)] mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-neutral-11 font-bold">{typeTitle}</p>
        </div>

        <div className="grid gap-6 col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
          <CreateContestTypesAnyoneCanPlay
            isSelected={contestType === ContestType.AnyoneCanPlay}
            onClick={type => handleTypeSelection(type)}
            faqLink={faqLink}
          />
          <CreateContestTypesEntryBased
            isSelected={contestType === ContestType.EntryContest}
            onClick={type => handleTypeSelection(type)}
            faqLink={faqLink}
          />

          <CreateContestTypesVotingBased
            isSelected={contestType === ContestType.VotingContest}
            onClick={type => handleTypeSelection(type)}
            faqLink={faqLink}
          />
          <div className="mt-4">
            <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTypes;
