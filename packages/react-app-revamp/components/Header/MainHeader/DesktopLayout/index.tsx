import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import EthereumAddress from "@components/UI/EtheuremAddress";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_USER } from "@config/routes";
import Link from "next/link";
import { FC } from "react";

interface MainHeaderDesktopLayoutProps {
  isConnected: boolean;
  address: string;
}

const MainHeaderDesktopLayout: FC<MainHeaderDesktopLayoutProps> = ({ isConnected, address }) => {
  return (
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

      <div className="flex gap-3 items-center" style={{ minWidth: "260px" }}>
        {address ? (
          <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
            <EthereumAddress ethereumAddress={address} shortenOnFallback avatarVersion />
          </Link>
        ) : null}
        <ConnectButtonCustom />
      </div>
    </header>
  );
};

export default MainHeaderDesktopLayout;
