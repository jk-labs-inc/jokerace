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
    <header className="flex flex-row items-center justify-between px-4 mt-4">
      {pageAction === "create" && step > 0 && (
        <div onClick={onPreviousStep}>
          <Image src="/create-flow/back_mobile.svg" className="mt-[5px]" width={30} height={30} alt="back" />
        </div>
      )}

      <Link href={"/"}>
        <HomeIcon width={30} height={30} />
      </Link>

      <div className="flex items-center gap-5 text-[18px] md:text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 shadow-create-header">
        <p
          className={`cursor-pointer ${pageAction === "play" ? "text-primary-10" : "text-neutral-11"}`}
          onClick={() => setPageAction?.("play")}
        >
          play
        </p>
        <p
          className={`cursor-pointer ${pageAction === "create" ? "text-primary-10" : "text-neutral-11"}`}
          onClick={() => setPageAction?.("create")}
        >
          create
        </p>
      </div>
      <div
        onClick={isConnected ? openAccountModal : openConnectModal}
        className="md:hidden transition-all duration-500"
      >
        {isConnected ? (
          <div className="flex gap-2">
            {address && (
              <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
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

export default CreateFlowHeaderMobileLayout;
