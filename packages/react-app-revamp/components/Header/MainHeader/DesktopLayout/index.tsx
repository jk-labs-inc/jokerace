import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import CustomLink from "@components/UI/Link";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { FC, useEffect, useState } from "react";

interface MainHeaderDesktopLayoutProps {
  isConnected: boolean;
  address: string;
}

const MainHeaderDesktopLayout: FC<MainHeaderDesktopLayoutProps> = ({ isConnected, address }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="flex items-center justify-between pl-[120px] pr-[60px] mt-8">
      <CustomLink href="/">
        <h1 className="font-sabo-filled text-neutral-11 normal-case text-[40px]">
          J<span className="text-[30px]">oke</span>R<span className="text-[30px]">ace</span>
        </h1>
      </CustomLink>
      <div className="flex-1 flex justify-center items-center">
        <div
          className={`bg-true-black flex items-center gap-5 text-[24px] font-bold border-2 rounded-[20px] py-[2px] px-[30px] border-neutral-10 shadow-create-header`}
        >
          <CustomLink href={ROUTE_VIEW_LIVE_CONTESTS} className="text-neutral-11">
            play
          </CustomLink>
          <CustomLink href={ROUTE_CREATE_CONTEST} className="text-neutral-10">
            create
          </CustomLink>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        {isClient && address ? <UserProfileDisplay ethereumAddress={address} shortenOnFallback avatarVersion /> : null}
        <ConnectButtonCustom />
      </div>
    </header>
  );
};

export default MainHeaderDesktopLayout;
