import { MediaQuery } from "@helpers/mediaQuery";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { useAccount } from "wagmi";
import MainHeaderDesktopLayout from "./DesktopLayout";
import MainHeaderMobileLayout from "./MobileLayout";

interface MainHeaderProps {
  showProfile?: boolean;
}

const MainHeader: FC<MainHeaderProps> = ({ showProfile }) => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  return (
    <div>
      <MediaQuery maxWidth={1024}>
        <MainHeaderMobileLayout
          isConnected={isConnected}
          address={address ?? ""}
          openAccountModal={openAccountModal}
          openConnectModal={openConnectModal}
          showProfile={showProfile}
        />
      </MediaQuery>
      <MediaQuery minWidth={1025}>
        <MainHeaderDesktopLayout isConnected={isConnected} address={address ?? ""} />
      </MediaQuery>
    </div>
  );
};

export default MainHeader;
