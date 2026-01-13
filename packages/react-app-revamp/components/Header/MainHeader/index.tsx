import { MediaQuery } from "@helpers/mediaQuery";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { useConnection } from "wagmi";
import MainHeaderDesktopLayout from "./DesktopLayout";
import MainHeaderMobileLayout from "./MobileLayout";

interface MainHeaderProps {
  showProfile?: boolean;
}

const MainHeader: FC<MainHeaderProps> = ({ showProfile }) => {
  const { isConnected, address } = useConnection();
  const { openConnectModal } = useConnectModal();

  return (
    <div>
      <MediaQuery maxWidth={1024}>
        <MainHeaderMobileLayout isConnected={isConnected} address={address ?? ""} openConnectModal={openConnectModal} />
      </MediaQuery>
      <MediaQuery minWidth={1025}>
        <MainHeaderDesktopLayout isConnected={isConnected} address={address ?? ""} />
      </MediaQuery>
    </div>
  );
};

export default MainHeader;
