import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_USER } from "@config/routes";
import Link from "next/link";
import { FC } from "react";

interface MainHeaderDesktopLayoutProps {
  isConnected: boolean;
  address: string;
}

const MainHeaderDesktopLayout: FC<MainHeaderDesktopLayoutProps> = ({ isConnected, address }) => {
  return (
    <header className="px-10 flex items-center justify-between mt-2 mb-4">
      <Link href="/">
        <h1 className="font-sabo text-neutral-11 normal-case text-[40px]">JokeRace</h1>
      </Link>
      <div className="flex-1 flex justify-center items-center">
        <div
          className={`bg-true-black flex items-center gap-5 ${
            isConnected ? "ml-[100px]" : ""
          } text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-neutral-10 shadow-create-header`}
        >
          <Link href={ROUTE_VIEW_LIVE_CONTESTS} className="text-neutral-11">
            play
          </Link>
          <Link href={ROUTE_CREATE_CONTEST} className="text-neutral-10">
            create
          </Link>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        {address ? (
          <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
            <UserProfileDisplay ethereumAddress={address} shortenOnFallback avatarVersion />
          </Link>
        ) : null}
        <ConnectButtonCustom />
      </div>
    </header>
  );
};

export default MainHeaderDesktopLayout;
