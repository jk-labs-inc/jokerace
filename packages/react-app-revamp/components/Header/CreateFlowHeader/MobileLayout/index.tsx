import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import EthereumAddress from "@components/UI/EtheuremAddress";
import { ROUTE_VIEW_USER } from "@config/routes";
import { HomeIcon } from "@heroicons/react/outline";
import { PageAction } from "@hooks/useCreateFlowAction/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface CreateFlowHeaderMobileLayoutProps {
  address: string;
  isConnected: boolean;
  pageAction: PageAction;
  step: number;
  setPageAction?: (pageAction: PageAction) => void;
  openConnectModal?: () => void;
  openAccountModal?: () => void;
  onPreviousStep?: () => void;
}

const CreateFlowHeaderMobileLayout: FC<CreateFlowHeaderMobileLayoutProps> = ({
  address,
  isConnected,
  pageAction,
  step,
  setPageAction,
  openConnectModal,
  openAccountModal,
  onPreviousStep,
}) => {
  return (
    <>
      <header className={`flex flex-row items-center justify-between px-[30px] mt-4`}>
        {pageAction === "create" && step > 0 && (
          <div onClick={onPreviousStep}>
            <Image src="/create-flow/back_mobile.svg" className="mt-[5px]" width={30} height={30} alt="back" />
          </div>
        )}

        <div
          onClick={isConnected ? openAccountModal : openConnectModal}
          className="md:hidden transition-all duration-500"
        >
          {isConnected ? (
            <div className="flex gap-2 items-center">
              {address && (
                <>
                  <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
                    <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
                  </Link>
                  <ConnectButtonCustom displayOptions={{ onlyChainSwitcher: true, showChainName: false }} />
                </>
              )}
            </div>
          ) : null}
        </div>
      </header>
      <MainHeaderMobileLayout
        isConnected={isConnected}
        address={address}
        openAccountModal={openAccountModal}
        openConnectModal={openConnectModal}
      />
    </>
  );
};

export default CreateFlowHeaderMobileLayout;
