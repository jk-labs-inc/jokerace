import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { ROUTE_CREATE_CONTEST } from "@config/routes";
import { HomeIcon } from "@heroicons/react/outline";
import { ConnectButton, useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useMedia, useWindowScroll } from "react-use";
import { useAccount } from "wagmi";

const MainHeader = () => {
  const { isConnected } = useAccount();
  const onPreviousStep = usePreviousStep();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const isMobileOrTablet = useMedia("(max-width: 1024px)");
  const { y } = useWindowScroll();
  const backgroundColorOpacity = Math.min(y / 100, 1);
  const headerStyles = {
    // Modify this color to be the color you want for the background.
    // The opacity of this color will change based on how far the user has scrolled.
    backgroundColor: `rgba(18, 18, 18, ${backgroundColorOpacity})`,
    transition: "background-color 0.5s ease", // Smooth transition.
  };

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
          <Image width={30} height={30} src="/create-flow/wallet-connected.svg" alt="wallet-connected" />
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
        <header className="flex flex-row items-center justify-between px-[55px] mt-4 mb-4">
          <Link href="/">
            <h1 className="font-sabo text-primary-10 text-[40px]">JOKERACE</h1>
          </Link>

          <div className="bg-true-black flex items-center gap-5 text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 shadow-create-header">
            <Link href="/" className="text-primary-10">
              play
            </Link>
            <Link href={ROUTE_CREATE_CONTEST} className="text-neutral-11">
              create
            </Link>
          </div>

          <div className="flex">
            <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
          </div>
        </header>
      )}
    </div>
  );
};

export default MainHeader;
