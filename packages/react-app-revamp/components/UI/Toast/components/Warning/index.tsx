import Image from "next/image";
import { FC } from "react";

interface WarningToastProps {
  message: string;
}

const WarningToast: FC<WarningToastProps> = ({ message }) => (
  <div className="flex gap-4 items-center pl-4">
    <Image src="/toast/warning.svg" width={40} height={40} alt="warning" />
    <div className="flex flex-col">
      <p className="uppercase font-bold text-[16px]">Warning!</p>
      <p className="text-[12px]">{message}</p>
    </div>
  </div>
);

export default WarningToast;
