import { useConnectModal } from "@rainbow-me/rainbowkit";
import InfoPanel from "../../InfoPanel";

const RewardsPlayerViewNotConnected = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <InfoPanel
      title="my rewards"
      image="/rewards/wallet-not-connected.png"
      imageAlt="wallet not connected"
      heading="let's connect a wallet"
      description={
        <p className="text-[16px] text-neutral-11">
          wallets let you track what you earn. <br />
          don't have one? we'll help you make one.
        </p>
      }
      actionButton={{
        text: "connect wallet",
        onClick: () => openConnectModal?.(),
      }}
    />
  );
};

export default RewardsPlayerViewNotConnected;
