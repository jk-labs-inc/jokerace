/* eslint-disable @next/next/no-img-element */
import EthereumAddress from "@components/UI/EtheuremAddress";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_USER } from "@config/routes";
import { HomeIcon } from "@heroicons/react/outline";
import { ConnectButton, useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMedia } from "react-use";
import { useAccount } from "wagmi";

const MainHeader = () => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const isMobileOrTablet = useMedia("(max-width: 1024px)");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lowerDeviceHeader = (
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
            {isClient && address && (
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

  return (
    <div>
      {isMobileOrTablet ? (
        lowerDeviceHeader
      ) : (
        <header className="px-10  mx-auto flex items-center justify-between mt-2 mb-4">
          <Link href="/">
            <h1 className="font-sabo text-primary-10 text-[40px]">JOKERACE</h1>
          </Link>
          <div className="flex-1 flex justify-center items-center">
            <div
              className={`bg-true-black flex items-center gap-5 ${
                isConnected ? "ml-[100px]" : ""
              } text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 shadow-create-header`}
            >
              <Link href="/contests" className="text-primary-10">
                play
              </Link>
              <Link href={ROUTE_CREATE_CONTEST} className="text-neutral-11">
                create
              </Link>
            </div>
          </div>

          <div className="flex gap-3 items-center" style={{ minWidth: "260pxs" }}>
            {isClient && address ? (
              <Link href={`${ROUTE_VIEW_USER}/${address}`}>
                <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
              </Link>
            ) : null}
            <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
          </div>
        </header>
      )}
    </div>
  );
};

export default MainHeader;
