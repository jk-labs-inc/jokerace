import { IconTrophy } from "@components/UI/Icons";
import LinkNavigation from "@components/UI/Link";
import { MobileProfilePortal } from "@components/UI/MobileWalletPortal";
import {
  ROUTE_CREATE_CONTEST,
  ROUTE_LANDING,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
} from "@config/routes";
import { config } from "@config/wagmi";
import { HomeIcon, MagnifyingGlassIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { disconnect } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";

interface MainHeaderMobileLayoutProps {
  isConnected: boolean;
  address: string;
  openConnectModal?: () => void;
}

const MainHeaderMobileLayout: FC<MainHeaderMobileLayoutProps> = ({ isConnected, address, openConnectModal }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isInPwaMode, setIsInPwaMode] = useState(false);
  const [showWalletPortal, setShowWalletPortal] = useState(false);
  const isActive = (route: string) => (pathname === route ? "text-positive-11 transition-colors font-bold" : "");
  const isOneOfActive = (routes: string[]) =>
    routes.includes(pathname ?? "") ? "text-positive-11 transition-colors font-bold" : "";

  useEffect(() => {
    setIsClient(true);
    setIsInPwaMode(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  const handleWalletClick = () => {
    setShowWalletPortal(true);
  };

  const closeWalletPortal = useCallback(() => {
    setShowWalletPortal(false);
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect(config);
      closeWalletPortal();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }, [closeWalletPortal]);

  const WalletPortal = () => {
    if (!isClient) return null;

    return (
      <MobileProfilePortal
        isOpen={showWalletPortal}
        onClose={closeWalletPortal}
        address={address}
        onDisconnect={handleDisconnect}
      />
    );
  };

  return (
    <>
      <header
        className={`h-12 flex flex-row bottom-0 right-0 left-0 fixed items-center justify-between border-t-neutral-2 border-t-2 pt-2 ${
          isClient && isInPwaMode ? "pb-8" : "pb-2"
        } px-8 mt-4 bg-true-black z-50`}
      >
        <LinkNavigation href={ROUTE_LANDING} className={`flex flex-col ${isActive(ROUTE_LANDING)}`}>
          <HomeIcon width={22} />
          <p className="text-[12px]">home</p>
        </LinkNavigation>

        <LinkNavigation href={ROUTE_VIEW_CONTESTS} className={`flex flex-col ${isActive(ROUTE_VIEW_CONTESTS)}`}>
          <MagnifyingGlassIcon width={22} />
          <p className="text-[12px]">search</p>
        </LinkNavigation>

        <LinkNavigation
          href={ROUTE_VIEW_LIVE_CONTESTS}
          className={`flex flex-col text-neutral-11 ${isOneOfActive([ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_CONTEST])}`}
        >
          <IconTrophy width={22} height={22} />
          <p className="text-[12px] text-center">play</p>
        </LinkNavigation>

        <LinkNavigation
          href={ROUTE_CREATE_CONTEST}
          className={`flex flex-col items-center ${isActive(ROUTE_CREATE_CONTEST)}`}
        >
          <PencilSquareIcon width={22} />
          <p className="text-[12px]">create</p>
        </LinkNavigation>

        <div className="transition-all duration-500">
          {isConnected ? (
            <div className="flex flex-col items-center" onClick={handleWalletClick}>
              <UserCircleIcon width={22} height={22} className="text-neutral-11" />
              <p className="text-[12px]">profile</p>
            </div>
          ) : (
            <div className="flex flex-col items-center" onClick={openConnectModal}>
              <img width={22} height={22} src="/header/wallet.svg" alt="wallet" />
              <p className="text-[12px]">wallet</p>
            </div>
          )}
        </div>
      </header>

      <WalletPortal />
    </>
  );
};

export default MainHeaderMobileLayout;
