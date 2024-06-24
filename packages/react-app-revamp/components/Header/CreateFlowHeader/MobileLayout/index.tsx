import BurgerMenu from "@components/UI/BurgerMenu";
import ButtonV3 from "@components/UI/ButtonV3";
import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import { IconTrophy } from "@components/UI/Icons";
import { steps } from "@components/_pages/Create";
import MobileStepper from "@components/_pages/Create/components/MobileStepper";
import { useCreateContestStartStore } from "@components/_pages/Create/pages/ContestStart";
import { StepTitle } from "@components/_pages/Create/types";
import { FOOTER_LINKS } from "@config/links";
import {
  ROUTE_CREATE_CONTEST,
  ROUTE_LANDING,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
} from "@config/routes";
import { HomeIcon, PencilAltIcon, SearchIcon } from "@heroicons/react/outline";
import { PageAction } from "@hooks/useCreateFlowAction/store";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC, useMemo } from "react";

interface CreateFlowHeaderMobileLayoutProps {
  address: string;
  isConnected: boolean;
  pageAction: PageAction;
  step: number;
  openConnectModal?: () => void;
  onPreviousStep?: () => void;
}

const CreateFlowHeaderMobileLayout: FC<CreateFlowHeaderMobileLayoutProps> = ({
  isConnected,
  pageAction,
  step,
  openConnectModal,
  onPreviousStep,
}) => {
  const pathname = usePathname();
  const { setMobileStepTitle, isLoading: isDeployingContestLoading, stepConfig } = useDeployContestStore();
  const { setStartContest, startContest, startContestWithTemplate, setStartContestWithTemplate } =
    useCreateContestStartStore();

  const contestCreationInProgress = useMemo(
    () => pageAction === "create" && step > 0 && (startContest || startContestWithTemplate),
    [pageAction, step, startContest, startContestWithTemplate],
  );

  const currentSteps = useMemo(
    () => (startContestWithTemplate ? stepConfig.map(config => ({ title: config.key as StepTitle })) : steps),
    [startContestWithTemplate, stepConfig],
  );

  const isLastStep = step === currentSteps.length;
  const isInPwaMode = typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches;

  const handleBack = () => {
    if (step === 1) {
      startContestWithTemplate ? setStartContestWithTemplate(false) : setStartContest(false);
    } else {
      onPreviousStep?.();
    }
  };

  const handleMobileStep = () => {
    const currentStepTitle = currentSteps[step - 1].title;
    setMobileStepTitle(currentStepTitle);
  };

  const renderNavigationItem = (route: string, icon: React.ReactNode, label: string) => (
    <Link
      href={route}
      className={`flex flex-col items-center ${pathname === route ? "text-primary-10 font-bold" : ""}`}
    >
      {icon}
      <p className="text-[12px]">{label}</p>
    </Link>
  );

  const renderWalletOrMenu = () => (
    <div onClick={isConnected ? undefined : openConnectModal} className="transition-all duration-500">
      {isConnected ? (
        <BurgerMenu>
          <div className="flex flex-col h-full justify-between pb-4">
            <ConnectButtonCustom />
            <div className="flex justify-end flex-col gap-2">
              {FOOTER_LINKS.filter(link =>
                ["Github", "Twitter", "Telegram", "Report a bug", "Terms", "Media Kit"].includes(link.label),
              ).map((link, key) => (
                <a
                  key={`footer-link-${key}`}
                  className="font-sabo text-neutral-11 text-[24px]"
                  href={link.href}
                  rel="nofollow noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </BurgerMenu>
      ) : (
        <div className="flex flex-col items-center">
          <Image width={26} height={26} src="/header/wallet.svg" alt="wallet" />
          <p className="text-[12px]">wallet</p>
        </div>
      )}
    </div>
  );

  if (!contestCreationInProgress) {
    return null;
  }

  return (
    <div className="mt-8">
      {!isDeployingContestLoading && <MobileStepper currentStep={step - 1} totalSteps={currentSteps.length} />}
      <header
        className={`flex flex-col fixed mt-4 bottom-0 right-0 left-0 ${isInPwaMode ? "pb-8" : "pb-2"} bg-true-black z-50`}
      >
        {!isDeployingContestLoading && (
          <div className="flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2 px-8">
            <p className="text-[20px] text-neutral-11" onClick={handleBack}>
              back
            </p>
            <ButtonV3
              onClick={handleMobileStep}
              colorClass={`text-[20px] ${isLastStep ? "bg-gradient-create" : "bg-gradient-next"} rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out`}
            >
              {isLastStep ? "create" : "next"}
            </ButtonV3>
          </div>
        )}
        <div className="flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2 pt-2 px-8">
          {renderNavigationItem(ROUTE_LANDING, <HomeIcon width={26} />, "home")}
          {renderNavigationItem(ROUTE_VIEW_CONTESTS, <SearchIcon width={26} />, "search")}
          {renderNavigationItem(ROUTE_VIEW_LIVE_CONTESTS, <IconTrophy width={26} height={26} />, "play")}
          {renderNavigationItem(ROUTE_CREATE_CONTEST, <PencilAltIcon width={26} />, "create")}
          {renderWalletOrMenu()}
        </div>
      </header>
    </div>
  );
};

export default CreateFlowHeaderMobileLayout;
