import EthereumDeploymentModal from "@components/UI/Deployment/Ethereum";
import GradientText from "@components/UI/GradientText";
import { FOOTER_LINKS } from "@config/links";
import { emailRegex } from "@helpers/regex";
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
import CreateContestConfirmEmailSubscription from "./components/EmailSubscription";
import CreateContestConfirmMonetization from "./components/Monetization";
import CreateContestConfirmPreview from "./components/Preview";
import CreateContestConfirmTiming from "./components/Timing";
import CreateContestConfirmTitle from "./components/Title";
import CreateContestConfirmType from "./components/Type";
import { ContestType } from "../../types";
import useChargeDetails from "@hooks/useChargeDetails";
import TestnetDeploymentModal from "@components/UI/Deployment/Testnet";

const ETHEREUM_MAINNET_CHAIN_ID = 1;

const CreateContestConfirm = () => {
  const { chainId, chain } = useAccount();
  const { steps, stepReferences } = useContestSteps();
  const { setEmailSubscriptionAddress, ...state } = useDeployContestStore(state => state);
  const { deployContest } = useDeployContest();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isEthereumDeploymentModalOpen, setIsEthereumDeploymentModalOpen] = useState(false);
  const tosHref = FOOTER_LINKS.find(link => link.label === "Terms")?.href;
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isTestnetDeploymentModalOpen, setIsTestnetDeploymentModalOpen] = useState(false);
  const [isChainDetailsLoading, setIsChainDetailsLoading] = useState(false);

  const onDeployHandler = useCallback(() => {
    if (chainId === ETHEREUM_MAINNET_CHAIN_ID) {
      setIsEthereumDeploymentModalOpen(true);
    } else if (chain?.testnet) {
      setIsTestnetDeploymentModalOpen(true);
    } else {
      deployContest();
    }
  }, [chainId, deployContest]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value) {
      setEmailError(null);
    } else if (emailRegex.test(value)) {
      setEmailError(null);
    } else {
      setEmailError("Invalid email address.");
    }
    setEmailSubscriptionAddress(value);
  };

  const onNavigateToStep = (stepIndex: number) => {
    state.setStep(stepIndex);
  };

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={state.step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="flex flex-col gap-8 md:ml-10">
          <GradientText textSizeClassName="text-[24px] font-bold" isFontSabo={false}>
            let's confirm
          </GradientText>
          <CreateContestConfirmTitle
            step={stepReferences.ContestRules}
            title={state.title}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmDescription
            step={stepReferences.ContestRules}
            prompt={state.prompt}
            imageUrl={state.prompt.imageUrl}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmType
            step={
              state.contestType === ContestType.EntryContest ? stepReferences.ContestVoting : stepReferences.ContestType
            }
            type={state.contestType}
            votingAllowlist={state.votingAllowlist}
            votingRequirements={state.votingRequirements}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmPreview
            step={stepReferences.ContestEntries}
            entryPreviewConfig={state.entryPreviewConfig}
            metadataFields={state.metadataFields}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmTiming
            step={stepReferences.ContestTiming}
            onClick={step => onNavigateToStep(step)}
            timing={{
              submissionOpen: state.submissionOpen,
              votingOpen: state.votingOpen,
              votingClose: state.votingClose,
            }}
          />
          <CreateContestConfirmMonetization
            step={stepReferences.ContestMonetization}
            charge={state.charge}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmCustomization
            customization={{
              customization: state.customization,
              advancedOptions: state.advancedOptions,
            }}
            step={stepReferences.ContestRules}
            onClick={step => onNavigateToStep(step)}
          />
          <div className="flex flex-col gap-8 mt-6">
            <CreateContestConfirmEmailSubscription
              emailError={emailError}
              emailSubscriptionAddress={state.emailSubscriptionAddress}
              tosHref={tosHref}
              handleEmailChange={handleEmailChange}
            />

            <CreateContestButton step={state.step} onClick={onDeployHandler} isDisabled={!!emailError} />
          </div>
        </div>

        <EthereumDeploymentModal
          isOpen={isEthereumDeploymentModalOpen}
          setIsOpen={value => setIsEthereumDeploymentModalOpen(value)}
          onDeploy={deployContest}
        />
        <TestnetDeploymentModal
          isOpen={isTestnetDeploymentModalOpen}
          setIsOpen={value => setIsTestnetDeploymentModalOpen(value)}
          onDeploy={deployContest}
        />
      </div>
    </div>
  );
};

export default CreateContestConfirm;
