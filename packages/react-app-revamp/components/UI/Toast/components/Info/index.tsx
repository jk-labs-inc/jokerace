import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface InfoToastProps {
  message: string;
}

const InfoToast: FC<InfoToastProps> = ({ message }) => (
  <div className="flex gap-4 items-center pl-4">
    <div className="flex gap-4 items-center">
      <InformationCircleIcon className="w-10 h-10 text-true-black" />
      <p className="text-[14px] font-bold">{message}</p>
    </div>
  </div>
);

export default InfoToast;
