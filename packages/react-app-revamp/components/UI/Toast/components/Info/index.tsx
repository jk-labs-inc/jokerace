import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode } from "react";

interface InfoToastProps {
  message: ReactNode;
  additionalMessage?: ReactNode;
}

const InfoToast: FC<InfoToastProps> = ({ message, additionalMessage }) => (
  <div className="flex gap-4 items-center pl-4">
    <div className="flex gap-4 items-center">
      <InformationCircleIcon className="w-10 h-10 text-true-black" />
      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-bold">{message}</p>
        {additionalMessage && <p className="text-[11px]">{additionalMessage}</p>}
      </div>
    </div>
  </div>
);

export default InfoToast;
