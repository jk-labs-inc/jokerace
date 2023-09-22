import { ClipboardIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { FC, useState } from "react";

interface ErrorToastProps {
  messageToShow: string;
  messageToCopy?: string;
}

const ErrorToast: FC<ErrorToastProps> = ({ messageToShow, messageToCopy }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!messageToCopy) return;

    try {
      await navigator.clipboard.writeText(messageToCopy);
      setCopySuccess(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex gap-4 items-center pl-4 py-2 ">
      <Image src="/toast/sadboi.png" width={40} height={40} alt="error" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-[14px] font-medium">{messageToShow}</p>
          {messageToCopy && (
            <p className="text-[10px]">
              Note: The issue might be with your wallet or browser—please consider trying different ones if possible.
            </p>
          )}
        </div>
        {messageToCopy && (
          <div className="flex gap-1 items-center">
            <ClipboardIcon className="w-4 h-4" />
            <p
              className="text-[10px] text-true-black uppercase font-bold hover:text-neutral-0 cursor-pointer"
              onClick={copyToClipboard}
            >
              {copySuccess ? "Copied to clipboard!" : "Copy error details"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorToast;
