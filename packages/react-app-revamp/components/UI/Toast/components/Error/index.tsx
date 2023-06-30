import Image from "next/image";
import { FC } from "react";

interface ErrorToastProps {
  message: string;
}

const ErrorToast: FC<ErrorToastProps> = ({ message }) => (
  <div className="flex gap-4 items-center pl-4">
    <Image src="/toast/error.svg" width={40} height={40} alt="error" />
    <div className="flex flex-col">
      <p className="uppercase font-bold text-[16px]">Error!</p>
      <p className="text-[12px]">{message}</p>
    </div>
  </div>
);

export default ErrorToast;
