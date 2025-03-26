import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import { IconTrophy } from "@components/UI/Icons";
import LinkNavigation from "@components/UI/Link";
import { MobileProfilePortal } from "@components/UI/MobileWalletPortal";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { FOOTER_LINKS } from "@config/links";
import {
  ROUTE_CREATE_CONTEST,
  ROUTE_LANDING,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
} from "@config/routes";
import { config } from "@config/wagmi";
import { HomeIcon, MagnifyingGlassIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { disconnect } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";

const LandingHeader = () => {
  const { isConnected, address } = useAccount();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const pathname = usePathname();
  const [isInPwaMode, setIsInPwaMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isActive = (route: string) => (pathname === route ? "text-positive-11 transition-colors font-bold" : "");
  const isOneOfActive = (routes: string[]) =>
    routes.includes(pathname ?? "") ? "text-positive-11 transition-colors font-bold" : "";
  const { openConnectModal } = useConnectModal();
  const allowedLinks = ["Github", "Twitter", "Report a bug", "Terms", "Telegram", "Media Kit", "FAQ", "Substack"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const [showWalletPortal, setShowWalletPortal] = useState(false);

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
        address={address ?? ""}
        onDisconnect={handleDisconnect}
      />
    );
  };

  if (isMobile) {
    return (
      <>
        <LinkNavigation href="/">
          <div className="pl-4 md:pl-16 md:pr-16 3xl:pl-28">
            <h1 className="font-sabo text-neutral-11 normal-case text-[45px] relative">
              <span className="joke-3d" data-text="J">
                J
              </span>
              <span className="text-[35px] joke-3d">oke</span>
              <span className="joke-3d">R</span>
              <span className="text-[35px] joke-3d">ace</span>
            </h1>
          </div>
        </LinkNavigation>
        <header className="bg-true-black">
          <div
            className={`fixed bottom-0 left-0 right-0 flex flex-col border-t-2 border-neutral-2 bg-true-black z-50 ${
              isClient && isInPwaMode ? "pb-8" : "pb-2"
            }`}
          >
            <div className="text-neutral-10 flex justify-center items-center text-[12px] py-3 border-b border-neutral-2">
              <div className="flex justify-center gap-2 items-center w-full">
                {filteredLinks.map((link, key) => (
                  <a
                    className="font-bold"
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
            <div className="flex flex-row items-center justify-between pt-2 px-8">
              <LinkNavigation href={ROUTE_LANDING} className={`flex flex-col ${isActive(ROUTE_LANDING)}`}>
                <HomeIcon width={26} />
                <p className="text-[12px]">home</p>
              </LinkNavigation>

              <LinkNavigation href={ROUTE_VIEW_CONTESTS} className={`flex flex-col ${isActive(ROUTE_VIEW_CONTESTS)}`}>
                <MagnifyingGlassIcon width={26} />
                <p className="text-[12px]">search</p>
              </LinkNavigation>

              <LinkNavigation
                href={ROUTE_VIEW_LIVE_CONTESTS}
                className={`flex flex-col text-neutral-11 ${isOneOfActive([ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_CONTEST])}`}
              >
                <IconTrophy width={26} height={26} />
                <p className="text-[12px] text-center">play</p>
              </LinkNavigation>

              <LinkNavigation
                href={ROUTE_CREATE_CONTEST}
                className={`flex flex-col items-center ${isActive(ROUTE_CREATE_CONTEST)}`}
              >
                <PencilSquareIcon width={26} />
                <p className="text-[12px]">create</p>
              </LinkNavigation>

              <div className="transition-all duration-500">
                {isConnected ? (
                  <div className="flex flex-col items-center" onClick={handleWalletClick}>
                    <UserCircleIcon width={26} height={26} className="text-neutral-11" />
                    <p className="text-[12px]">profile</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center" onClick={openConnectModal}>
                    <img width={26} height={26} src="/header/wallet.svg" alt="wallet" />
                    <p className="text-[12px]">wallet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <WalletPortal />
        </header>
      </>
    );
  }

  return (
    <header className="flex items-center pl-16 3xl:pl-28 pr-[60px] mt-4 max-w-[1850px]">
      <LinkNavigation href="/">
        <div>
          <h1 className="font-sabo text-neutral-11 normal-case text-[60px]">
            <span className="joke-3d" data-text="J">
              J
            </span>
            <span className="text-[45px] joke-3d">oke</span>
            <span className="joke-3d">R</span>
            <span className="text-[45px] joke-3d">ace</span>
          </h1>
        </div>
      </LinkNavigation>

      <div className="flex gap-3 items-center ml-auto">
        {isClient && address ? <UserProfileDisplay ethereumAddress={address} shortenOnFallback avatarVersion /> : null}
        <ConnectButtonCustom />
      </div>
    </header>
  );
};

export default LandingHeader;
