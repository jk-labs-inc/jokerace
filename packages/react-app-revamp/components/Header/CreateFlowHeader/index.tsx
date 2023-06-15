import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { HomeIcon } from "@heroicons/react/outline";
import { usePageActionStore } from "@hooks/useCreateFlowAction/store";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { ConnectButton, useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useMedia, useWindowSize } from "react-use";
import { useAccount } from "wagmi";
import Confetti from "react-confetti";

const CreateFlowHeader = () => {
  const { isConnected } = useAccount();
  const { step, isLoading, isSuccess } = useDeployContestStore(state => state);
  const { pageAction, setPageAction } = usePageActionStore(state => state);
  const onPreviousStep = usePreviousStep();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const isMobileOrTablet = useMedia("(max-width: 1024px)");
  const { width, height } = useWindowSize();

  useEffect(() => {
    return () => {
      setPageAction("create");
    };
  }, []);

  const lowerDeviceHeader = (
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
          onClick={() => setPageAction("play")}
        >
          play
        </p>
        <p
          className={`cursor-pointer ${pageAction === "create" ? "text-primary-10" : "text-neutral-11"}`}
          onClick={() => setPageAction("create")}
        >
          create
        </p>
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
        <header className="flex flex-row items-center justify-between pl-[80px] pr-[60px] mt-8">
          <Link href="/">
            <h1 className="font-sabo text-primary-10 text-[40px]">JOKERACE</h1>
          </Link>

          {!isLoading && !isSuccess && (
            <div className="flex items-center gap-5 text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-primary-10 shadow-create-header">
              <p
                className={`cursor-pointer ${pageAction === "play" ? "text-primary-10" : "text-neutral-11"}`}
                onClick={() => setPageAction("play")}
              >
                play
              </p>
              <p
                className={`cursor-pointer ${pageAction === "create" ? "text-primary-10" : "text-neutral-11"}`}
                onClick={() => setPageAction("create")}
              >
                create
              </p>
            </div>
          )}

          {isSuccess && <Confetti width={width} height={height} opacity={0.7} numberOfPieces={100} />}

          {!isLoading && !isSuccess && (
            <div className="flex">
              <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
            </div>
          )}
        </header>
      )}
    </div>
  );
};

export default CreateFlowHeader;
