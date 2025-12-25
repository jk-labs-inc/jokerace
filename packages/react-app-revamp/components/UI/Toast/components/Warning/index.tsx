import { FC, ReactNode } from "react";

interface WarningToastProps {
  message: string;
  additionalMessage?: ReactNode;
}

const WarningToast: FC<WarningToastProps> = ({ message, additionalMessage }) => (
  <div className="flex gap-4 items-center pl-4">
    <div className="flex flex-col">
      <p className="font-bold text-[16px]">{message}</p>
      {additionalMessage && <p className="text-[12px]">{additionalMessage}</p>}
    </div>
  </div>
);

export default WarningToast;
