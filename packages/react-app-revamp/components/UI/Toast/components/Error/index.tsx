import { ClipboardCopyIcon } from "@heroicons/react/outline";
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
    <div className="flex gap-4 items-center pl-4">
      <Image src="/toast/sadboi.png" width={40} height={40} alt="error" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <p className="uppercase font-bold text-[16px]">Error</p>
          <p className="text-[12px]">{messageToShow}</p>
        </div>
        {messageToCopy && (
          <p className="text-[8px] text-true-black uppercase font-bold" onClick={copyToClipboard}>
            {copySuccess ? "copied to clipboard!" : "copy full message"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorToast;
