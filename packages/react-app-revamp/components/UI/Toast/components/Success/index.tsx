import Image from "next/image";
import { FC } from "react";

interface SuccessToastProps {
  message: string;
}

const SuccessToast: FC<SuccessToastProps> = ({ message }) => (
  <div className="flex gap-4 items-center pl-4">
    <Image src="/toast/success.svg" width={40} height={40} alt="success" />
    <div className="flex flex-col">
      <p className="uppercase font-bold text-[16px]">Success!</p>
      <p className="text-[12px]">{message}</p>
    </div>
  </div>
);

export default SuccessToast;
