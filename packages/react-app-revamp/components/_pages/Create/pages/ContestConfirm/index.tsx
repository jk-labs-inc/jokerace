import EthereumDeploymentModal from "@components/UI/Deployment/Ethereum";
import GradientText from "@components/UI/GradientText";
import { useDeployContest } from "@hooks/useDeployContest";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useCallback, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import CreateContestButton from "../../components/Buttons/Submit";
import MobileStepper from "../../components/MobileStepper";
import { useContestSteps } from "../../hooks/useContestSteps";
import CreateContestConfirmCustomization from "./components/Customization";
import CreateContestConfirmDescription from "./components/Description";
import CreateContestConfirmMonetization from "./components/Monetization";
import CreateContestConfirmPreview from "./components/Preview";
import CreateContestConfirmTiming from "./components/Timing";
import CreateContestConfirmTitle from "./components/Title";
import CreateContestConfirmType from "./components/Type";

export enum Steps {
  ContestTitle = 0,
  ContestDescription = 1,
  ContestEntries = 2,
  ContestTag = 3,
  ContestTiming = 4,
  ContestSubmissions = 5,
  ContestVoting = 6,
  ContestMonetization = 7,
  ContestCustomization = 8,
  ContestType = 9,
}

const ETHEREUM_MAINNET_CHAIN_ID = 1;

const CreateContestConfirm = () => {
  const { chainId, chain } = useAccount();
  const { steps } = useContestSteps();
  const { ...state } = useDeployContestStore(state => state);
  const { deployContest } = useDeployContest();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isEthereumDeploymentModalOpen, setIsEthereumDeploymentModalOpen] = useState(false);

  const onDeployHandler = useCallback(() => {
    if (chainId === ETHEREUM_MAINNET_CHAIN_ID) {
      setIsEthereumDeploymentModalOpen(true);
    } else {
      deployContest();
    }
  }, [chainId, deployContest]);

  const onNavigateToStep = (step: Steps) => {
    state.setStep(step);
  };

  // todo: adjust steps to be based on the contest type
  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={state.step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="flex flex-col gap-8 md:ml-10">
          <GradientText
            text="let’s confirm"
            isStrikethrough={false}
            textSizeClassName="text-[24px] font-bold"
            isFontSabo={false}
          />
          <CreateContestConfirmTitle
            step={Steps.ContestTitle}
            title={state.title}
            onClick={step => onNavigateToStep(step)}
          />

          <CreateContestConfirmDescription
            step={Steps.ContestDescription}
            prompt={state.prompt}
            imageUrl={state.prompt.imageUrl}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmType
            step={Steps.ContestType}
            type={state.contestType}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmPreview
            step={Steps.ContestEntries}
            entryPreviewConfig={state.entryPreviewConfig}
            metadataFields={state.metadataFields}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmTiming
            step={Steps.ContestTiming}
            onClick={step => onNavigateToStep(step)}
            timing={{
              submissionOpen: state.submissionOpen,
              votingOpen: state.votingOpen,
              votingClose: state.votingClose,
            }}
          />
          <CreateContestConfirmMonetization
            step={Steps.ContestMonetization}
            charge={state.charge}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmCustomization
            customization={{
              customization: state.customization,
              advancedOptions: state.advancedOptions,
            }}
            step={Steps.ContestCustomization}
            onClick={step => onNavigateToStep(step)}
          />
          <div className="mt-12">
            <CreateContestButton step={state.step} onClick={onDeployHandler} />
          </div>
        </div>
        <EthereumDeploymentModal
          isOpen={isEthereumDeploymentModalOpen}
          setIsOpen={value => setIsEthereumDeploymentModalOpen(value)}
          onDeploy={deployContest}
        />
      </div>
    </div>
  );
};

export default CreateContestConfirm;
