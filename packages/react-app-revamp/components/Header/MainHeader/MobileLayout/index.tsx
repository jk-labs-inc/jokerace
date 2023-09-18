import EthereumAddress from "@components/UI/EtheuremAddress";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_USER } from "@config/routes";
import { HomeIcon } from "@heroicons/react/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
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
  return (
    <header className="flex flex-row items-center justify-between px-4 mt-4">
      <Link href={"/"}>
        <HomeIcon width={30} height={30} />
      </Link>

      <div className="flex items-center gap-5 text-[18px] md:text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 shadow-create-header">
        <Link href="/" className="text-primary-10">
          play
        </Link>
        <Link href={ROUTE_CREATE_CONTEST} className="text-neutral-11">
          create
        </Link>
      </div>
      <div
        onClick={isConnected ? openAccountModal : openConnectModal}
        className="md:hidden transition-all duration-500"
      >
        {isConnected ? (
          <div className="flex gap-2">
            {address && (
              <Link href={`${ROUTE_VIEW_USER}/${address}`}>
                <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
              </Link>
            )}
            <Image width={30} height={30} src="/create-flow/wallet-connected.svg" alt="wallet-connected" />
          </div>
        ) : (
          <Image width={30} height={30} src="/create-flow/wallet.svg" alt="wallet" />
        )}
      </div>
      <div className="hidden md:flex">
        <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
      </div>
    </header>
  );
};

export default MainHeaderMobileLayout;
