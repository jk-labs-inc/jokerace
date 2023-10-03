import Button from "@components/UI/Button";
import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import EthereumAddress from "@components/UI/EtheuremAddress";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_USER } from "@config/routes";
import { MediaQuery } from "@helpers/mediaQuery";
import { ConnectButton, useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import MainHeaderMobileLayout from "../MainHeader/MobileLayout";

const LandingHeader = () => {
  const { isConnected, address } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="flex items-center flex-col lg:flex-row gap-5 lg:gap-20 lg:pl-8 lg:pr-8 max-w-[1350px] 3xl:pl-16">
      <Link href="/">
        <div>
          <h1 className="font-sabo text-primary-10 text-[55px] md:text-[80px]">JOKERACE</h1>
          <p className="text-primary-10 text-700 text-center lg:text-left lg:pl-9 3xl:pl-12 font-bold mt-[-10px] text-[20px] md:text-[20px]">
            noun. US /dʒoʊ·​kreɪs/
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-5 text-[18px]">
        <p className="text-[18px] md:text-[20px] lg:hidden font-bold">
          contests for communities to make, <br />
          execute, and reward decisions
        </p>
        <Link href={ROUTE_CREATE_CONTEST}>
          <Button className="hidden lg:flex h-10" intent={`${isConnected ? "primary" : "neutral-outline"}`}>
            {/* //TODO: same font sizes for create contest + connect wallet */}
            Create contest
          </Button>
        </Link>
        <div className="hidden lg:flex items-center gap-3">
          {isClient && address && (
            <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
              <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
            </Link>
          )}
          <ConnectButtonCustom />
        </div>
      </div>

      <MediaQuery maxWidth={768}>
        <MainHeaderMobileLayout
          isConnected={isConnected}
          address={address ?? ""}
          openAccountModal={openAccountModal}
          openConnectModal={openConnectModal}
        />
      </MediaQuery>
    </header>
  );
};

export default LandingHeader;
