import { FC } from "react";

interface ConnectWalletOverlayProps {
  onConnect: () => void;
}

const ConnectWalletOverlay: FC<ConnectWalletOverlayProps> = ({ onConnect }) => {
  return (
    <button className="absolute inset-0 flex items-center justify-center" onClick={onConnect}>
      <p className="text-positive-11 text-[16px] font-bold">connect wallet to add votes</p>
    </button>
  );
};

export default ConnectWalletOverlay;
