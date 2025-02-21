import { FC } from "react";
import { FadeLoader } from "react-spinners";

export enum LoadingToastMessageType {
  WALLET_SIGNATURE = "walletSignature",
  KEEP_BROWSER_OPEN = "keepBrowserOpen",
  NONE = "none",
}

interface LoadingToastProps {
  message: string;
  additionalMessageType?: LoadingToastMessageType;
}

const LoadingToast: FC<LoadingToastProps> = ({ message, additionalMessageType = LoadingToastMessageType.NONE }) => {
  const getAdditionalMessage = () => {
    switch (additionalMessageType) {
      case LoadingToastMessageType.WALLET_SIGNATURE:
        return "check wallet to sign all transactions";
      case LoadingToastMessageType.KEEP_BROWSER_OPEN:
        return "please don’t close browser until confirmation appears";
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4 items-center pl-4">
      <FadeLoader />
      <div className="flex flex-col">
        <p className="font-bold text-[14px]">{message}</p>
        {additionalMessageType !== LoadingToastMessageType.NONE && (
          <p className="text-[12px]">{getAdditionalMessage()}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingToast;
