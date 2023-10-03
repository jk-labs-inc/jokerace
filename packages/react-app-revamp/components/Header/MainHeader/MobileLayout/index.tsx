import EthereumAddress from "@components/UI/EtheuremAddress";
import { IconTrophy } from "@components/UI/Icons";
import {
  ROUTE_CREATE_CONTEST,
  ROUTE_LANDING,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTESTS,
  ROUTE_VIEW_LIVE_CONTESTS,
  ROUTE_VIEW_USER,
} from "@config/routes";
import { HomeIcon, PencilAltIcon, PencilIcon, SearchIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

interface MainHeaderMobileLayoutProps {
  isConnected: boolean;
  address: string;
  showProfile?: boolean;
  openConnectModal?: () => void;
  openAccountModal?: () => void;
}

const MainHeaderMobileLayout: FC<MainHeaderMobileLayoutProps> = ({
  isConnected,
  showProfile,
  address,
  openConnectModal,
  openAccountModal,
}) => {
  const router = useRouter();
  const isActive = (route: string) => (router.pathname === route ? "text-primary-10 transition-colors font-bold" : "");
  const isOneOfActive = (routes: string[]) =>
    routes.includes(router.pathname) ? "text-primary-10 transition-colors font-bold" : "";

  return (
    <>
      {address && showProfile && (
        <header className="top-0 right-0 left-0 px-4 mt-4">
          <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
            <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
          </Link>
        </header>
      )}

      <header className="flex flex-row bottom-0 right-0 left-0 fixed items-center justify-between border-t-neutral-2 border-t-2 py-1 px-8 mt-4 bg-true-black z-10">
        <Link href={ROUTE_LANDING} className={`flex flex-col ${isActive(ROUTE_LANDING)}`}>
          <HomeIcon width={27} />
          <p className="text-[12px]">home</p>
        </Link>

        <Link href={ROUTE_VIEW_CONTESTS} className={`flex flex-col ${isActive(ROUTE_VIEW_CONTESTS)}`}>
          <SearchIcon width={27} />
          <p className="text-[12px]">search</p>
        </Link>

        <Link
          href={ROUTE_VIEW_LIVE_CONTESTS}
          className={`flex flex-col text-neutral-11 ${isOneOfActive([ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_CONTEST])}`}
        >
          <IconTrophy width={27} height={27} />
          <p className="text-[12px] text-center">play</p>
        </Link>

        <Link href={ROUTE_CREATE_CONTEST} className={`flex flex-col items-center ${isActive(ROUTE_CREATE_CONTEST)}`}>
          <PencilAltIcon width={27} />
          <p className="text-[12px]">create</p>
        </Link>

        <div onClick={isConnected ? openAccountModal : openConnectModal} className="transition-all duration-500">
          {isConnected ? (
            <div className="flex flex-col items-center">
              <Image width={25} height={25} src="/header/wallet-connected.svg" alt="wallet-connected" />
              <p className="text-[12px]">wallet</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Image width={25} height={25} src="/header/wallet.svg" alt="wallet" />
              <p className="text-[12px]">wallet</p>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default MainHeaderMobileLayout;
