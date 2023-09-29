import { ROUTE_CREATE_CONTEST, ROUTE_LANDING, ROUTE_VIEW_CONTESTS, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { HomeIcon, SearchIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

interface MainHeaderMobileLayoutProps {
  isConnected: boolean;
  address: string;
  openConnectModal?: () => void;
  openAccountModal?: () => void;
}

const MainHeaderMobileLayout: FC<MainHeaderMobileLayoutProps> = ({
  isConnected,
  address,
  openConnectModal,
  openAccountModal,
}) => {
  const router = useRouter();
  const isActive = (route: string) => (router.pathname === route ? "text-primary-10 transition-colors" : "");

  return (
    <header className="flex flex-row bottom-0 right-0 left-0 fixed h-12 items-center justify-between border-t-neutral-2 border-t-2 px-8 mt-4 bg-true-black z-10">
      <Link href={ROUTE_LANDING} className={`flex flex-col ${isActive(ROUTE_LANDING)}`}>
        <HomeIcon width={31} height={26} />
        <p className="text-[12px]">home</p>
      </Link>

      <Link href={ROUTE_VIEW_CONTESTS} className="flex flex-col">
        <SearchIcon className="w-[27px]" />
        <p className="text-[12px]">search</p>
      </Link>

      <Link href={ROUTE_VIEW_LIVE_CONTESTS} className="flex flex-col">
        <Image src="/header/trophy.svg" width={27} height={27} alt="search" />
        <p className="text-[12px] text-center">play</p>
      </Link>

      <Link href={ROUTE_CREATE_CONTEST} className="flex flex-col items-center">
        <Image src="/header/create.svg" width={27} height={27} alt="search" />
        <p className="text-[12px]">create</p>
      </Link>

      <div
        onClick={isConnected ? openAccountModal : openConnectModal}
        className="md:hidden transition-all duration-500"
      >
        {isConnected ? (
          <div className="flex flex-col items-center">
            <Image width={27} height={27} src="/header/wallet-connected.svg" alt="wallet-connected" />
            <p className="text-[12px]">wallet</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Image width={27} height={27} src="/header/wallet.svg" alt="wallet" />
            <p className="text-[12px]">wallet</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainHeaderMobileLayout;
