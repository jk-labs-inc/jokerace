import BurgerMenu from "@components/UI/BurgerMenu";
import ButtonV3 from "@components/UI/ButtonV3";
import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import { IconTrophy } from "@components/UI/Icons";
import { steps } from "@components/_pages/Create";
import MobileStepper from "@components/_pages/Create/components/MobileStepper";
import { useCreateContestStartStore } from "@components/_pages/Create/pages/ContestStart";
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
import { FC, useState } from "react";

interface CreateFlowHeaderMobileLayoutProps {
  address: string;
  isConnected: boolean;
  pageAction: PageAction;
  step: number;
  setPageAction?: (pageAction: PageAction) => void;
  openConnectModal?: () => void;
  openAccountModal?: () => void;
  onPreviousStep?: () => void;
}

const CreateFlowHeaderMobileLayout: FC<CreateFlowHeaderMobileLayoutProps> = ({
  address,
  isConnected,
  pageAction,
  step,
  openConnectModal,
  onPreviousStep,
}) => {
  const { setMobileStepTitle, isLoading: isDeployingContestLoading } = useDeployContestStore(state => state);
  const allowedLinks = ["Github", "Twitter", "Telegram", "Report a bug", "Terms", "Media Kit"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setStartContest, startContest } = useCreateContestStartStore(state => state);
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const contestCreationInProgress = pageAction === "create" && step > 0 && startContest;
  const isActive = (route: string) => (pathname === route ? "text-primary-10 transition-colors font-bold" : "");
  const isOneOfActive = (routes: string[]) =>
    routes.includes(pathname ?? "") ? "text-primary-10 transition-colors font-bold" : "";
  const isLastStep = step === steps.length;

  const onBackHandler = () => {
    if (step === 1) {
      setStartContest(false);
    } else {
      onPreviousStep?.();
    }
  };

  const onMobileStepHandler = () => {
    setMobileStepTitle(steps[step - 1].title);
  };

  const onWalletClick = () => {
    if (isConnected) return;

    openConnectModal?.();
  };

  return (
    <div className={`${contestCreationInProgress ? "mt-8" : ""}`}>
      {contestCreationInProgress && !isDeployingContestLoading ? (
        <MobileStepper currentStep={step - 1} totalSteps={steps.length} />
      ) : null}
      <header
        className={`flex flex-col ${isBurgerMenuOpen ? "hidden" : "fixed"} mt-4 bottom-0 right-0 left-0 ${isInPwaMode ? "pb-8" : "pb-2"} bg-true-black z-50`}
      >
        {contestCreationInProgress && !isDeployingContestLoading && !isBurgerMenuOpen ? (
          <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2   px-8`}>
            <p className="text-[20px] text-neutral-11" onClick={onBackHandler}>
              back
            </p>
            <ButtonV3
              onClick={onMobileStepHandler}
              colorClass={`text-[20px] ${isLastStep ? "bg-gradient-create" : "bg-gradient-next"}  rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out`}
            >
              {isLastStep ? "create" : "next"}
            </ButtonV3>
          </div>
        ) : null}

        <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2 pt-2 px-8`}>
          <Link href={ROUTE_LANDING} className={`flex flex-col ${isActive(ROUTE_LANDING)}`}>
            <HomeIcon width={26} />
            <p className="text-[12px]">home</p>
          </Link>

          <Link href={ROUTE_VIEW_CONTESTS} className={`flex flex-col ${isActive(ROUTE_VIEW_CONTESTS)}`}>
            <SearchIcon width={26} />
            <p className="text-[12px]">search</p>
          </Link>

          <Link
            href={ROUTE_VIEW_LIVE_CONTESTS}
            className={`flex flex-col text-neutral-11 ${isOneOfActive([ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_CONTEST])}`}
          >
            <IconTrophy width={26} height={26} />
            <p className="text-[12px] text-center">play</p>
          </Link>

          <Link href={ROUTE_CREATE_CONTEST} className={`flex flex-col items-center ${isActive(ROUTE_CREATE_CONTEST)}`}>
            <PencilAltIcon width={26} />
            <p className="text-[12px]">create</p>
          </Link>

          <div onClick={onWalletClick} className="transition-all duration-500">
            {isConnected ? (
              <div className="flex flex-col items-center">
                <BurgerMenu onOpen={() => setIsBurgerMenuOpen(true)} onClose={() => setIsBurgerMenuOpen(false)}>
                  <div className="flex flex-col h-full justify-between pb-4">
                    <ConnectButtonCustom />
                    <div className="flex justify-end flex-col gap-2">
                      {filteredLinks.map((link, key) => (
                        <a
                          className="font-sabo text-neutral-11 text-[24px]"
                          key={`footer-link-${key}`}
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
                <p className="text-[12px]">menu</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Image width={26} height={26} src="/header/wallet.svg" alt="wallet" />
                <p className="text-[12px]">wallet</p>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default CreateFlowHeaderMobileLayout;
