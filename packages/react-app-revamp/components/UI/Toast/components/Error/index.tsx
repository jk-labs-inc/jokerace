import { ClipboardCopyIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { FC, useState } from "react";

interface ErrorToastProps {
  message: string;
}

const ErrorToast: FC<ErrorToastProps> = ({ message }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(message);
      setCopySuccess(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex gap-4 items-center pl-4">
      <Image src="/toast/sadboi.png" width={40} height={40} alt="error" />
      <div className="flex flex-col">
        <div className="flex gap-4">
          <p className="uppercase font-bold text-[16px]">Error!</p>
          <ClipboardCopyIcon onClick={copyToClipboard} className="h-5 w-5 cursor-pointer" />
        </div>

        <p className="text-[12px]">{message}</p>
        {copySuccess && <p className="text-[12px]">Copied to clipboard!</p>}
      </div>
    </div>
  );
};

export default ErrorToast;
