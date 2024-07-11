import BurgerMenu from "@components/UI/BurgerMenu";
import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import { IconTrophy } from "@components/UI/Icons";
import { FOOTER_LINKS } from "@config/links";
import {
  ROUTE_CREATE_CONTEST,
  ROUTE_LANDING,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
} from "@config/routes";
import { HomeIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { PageAction } from "@hooks/useCreateFlowAction/store";
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
}

const CreateFlowHeaderMobileLayout: FC<CreateFlowHeaderMobileLayoutProps> = ({
  address,
  isConnected,
  pageAction,
  step,
  openConnectModal,
}) => {
  const allowedLinks = ["Github", "Twitter", "Telegram", "Report a bug", "Terms", "Media Kit"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const pathname = usePathname();
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const isActive = (route: string) => (pathname === route ? "text-primary-10 transition-colors font-bold" : "");
  const isOneOfActive = (routes: string[]) =>
    routes.includes(pathname ?? "") ? "text-primary-10 transition-colors font-bold" : "";

  const onWalletClick = () => {
    if (isConnected) return;

    openConnectModal?.();
  };

  return (
    <header
      className={`flex flex-col ${isBurgerMenuOpen ? "hidden" : "fixed"} mt-4 bottom-0 right-0 left-0 ${isInPwaMode ? "pb-8" : "pb-2"} bg-true-black z-50`}
    >
      <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2 pt-2 px-8`}>
        <Link href={ROUTE_LANDING} className={`flex flex-col ${isActive(ROUTE_LANDING)}`}>
          <HomeIcon width={26} />
          <p className="text-[12px]">home</p>
        </Link>

        <Link href={ROUTE_VIEW_CONTESTS} className={`flex flex-col ${isActive(ROUTE_VIEW_CONTESTS)}`}>
          <MagnifyingGlassIcon width={26} />
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
          <PencilSquareIcon width={26} />
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
  );
};

export default CreateFlowHeaderMobileLayout;
