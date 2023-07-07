import { FC } from "react";
import { FadeLoader } from "react-spinners";

interface LoadingToastProps {
  message: string;
  showSignMessage?: boolean;
}

const LoadingToast: FC<LoadingToastProps> = ({ message, showSignMessage = true }) => (
  <div className="flex gap-2 items-center pl-4">
    <FadeLoader />
    <div className="flex flex-col">
      <p className="font-bold text-[16px]">{message}</p>
      {showSignMessage && <p className="text-[12px]">check wallet to sign all transactions</p>}
    </div>
  </div>
);

export default LoadingToast;
