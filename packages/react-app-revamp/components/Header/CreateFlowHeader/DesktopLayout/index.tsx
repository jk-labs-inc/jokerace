import EthereumAddress from "@components/UI/EtheuremAddress";
import { ROUTE_VIEW_USER } from "@config/routes";
import { PageAction } from "@hooks/useCreateFlowAction/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FC } from "react";
import Confetti from "react-confetti";

interface CreateFlowHeaderDesktopLayoutProps {
  address: string;
  isLoading: boolean;
  isSuccess: boolean;
  pageAction: PageAction;
  confettiWidth: number;
  confettiHeight: number;
  setPageAction?: (pageAction: PageAction) => void;
}

const CreateFlowHeaderDesktopLayout: FC<CreateFlowHeaderDesktopLayoutProps> = ({
  address,
  isLoading,
  isSuccess,
  pageAction,
  confettiWidth: width,
  confettiHeight: height,
  setPageAction,
}) => {
  return (
    <header className="flex flex-row items-center justify-between pl-[80px] pr-[60px] mt-8">
      <Link href="/">
        <h1 className="font-sabo text-primary-10 text-[40px]">JOKERACE</h1>
      </Link>

      {!isLoading && !isSuccess && (
        <div className="flex items-center gap-5 text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 shadow-create-header">
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
      )}

      {isSuccess && <Confetti width={width} height={height} opacity={0.7} numberOfPieces={100} />}

      {!isLoading && !isSuccess && (
        <div className="flex items-center gap-3">
          {address && (
            <Link href={`${ROUTE_VIEW_USER}/${address}`}>
              <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
            </Link>
          )}
          <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
        </div>
      )}
    </header>
  );
};

export default CreateFlowHeaderDesktopLayout;
