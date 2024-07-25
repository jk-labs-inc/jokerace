import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import { IconTrophy } from "@components/UI/Icons";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import {
  ROUTE_CREATE_CONTEST,
  ROUTE_LANDING,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
  ROUTE_VIEW_USER,
} from "@config/routes";
import { HomeIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";

const LandingHeader = () => {
  const { isConnected, address } = useAccount();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const pathname = usePathname();
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const isActive = (route: string) => (pathname === route ? "text-primary-10 transition-colors font-bold" : "");
  const isOneOfActive = (routes: string[]) =>
    routes.includes(pathname ?? "") ? "text-primary-10 transition-colors font-bold" : "";
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  if (isMobile) {
    return (
      <>
        <Link href="/">
          <div className="pl-4">
            <h1 className="font-sabo text-neutral-11 normal-case text-[45px]">
              J<span className="text-[35px]">oke</span>R<span className="text-[35px]">ace</span>
            </h1>
          </div>
        </Link>
        <header
          className={`flex flex-row bottom-0 right-0 left-0 fixed items-center justify-between border-t-neutral-2 border-t-2 pt-2 ${
            isInPwaMode ? "pb-8" : "pb-2"
          } px-8 mt-4 bg-true-black z-50`}
        >
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

          <div onClick={isConnected ? openAccountModal : openConnectModal} className="transition-all duration-500">
            {isConnected ? (
              <div className="flex flex-col items-center">
                <Image width={26} height={26} src="/header/wallet-connected.svg" alt="wallet-connected" />
                <p className="text-[12px]">wallet</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Image width={26} height={26} src="/header/wallet.svg" alt="wallet" />
                <p className="text-[12px]">wallet</p>
              </div>
            )}
          </div>
        </header>
      </>
    );
  }

  return (
    <header className="flex items-center justify-between pl-[120px] pr-[60px] mt-8">
      <Link href="/">
        <div>
          <h1 className="font-sabo text-neutral-11 normal-case text-[80px]">
            J<span className="text-[55px]">oke</span>R<span className="text-[55px]">ace</span>
          </h1>
        </div>
      </Link>

      <div className="flex gap-3 items-center">
        {address ? (
          <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
            <UserProfileDisplay ethereumAddress={address} shortenOnFallback avatarVersion />
          </Link>
        ) : null}
        <ConnectButtonCustom />
      </div>
    </header>
  );
};

export default LandingHeader;
