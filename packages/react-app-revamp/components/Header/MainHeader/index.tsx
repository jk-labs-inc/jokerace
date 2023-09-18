import { MediaQuery } from "@helpers/mediaQuery";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import MainHeaderDesktopLayout from "./DesktopLayout";
import MainHeaderMobileLayout from "./MobileLayout";

const MainHeader = () => {
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
        />
      </MediaQuery>
      <MediaQuery minWidth={1025}>
        <MainHeaderDesktopLayout isConnected={isConnected} address={address ?? ""} />
      </MediaQuery>
    </div>
  );
};

export default MainHeader;
