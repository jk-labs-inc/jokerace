import { populateBugReportLink } from "@helpers/githubIssue";
import { ClipboardIcon, FlagIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useUrl } from "nextjs-current-url";
import { FC, useState } from "react";
import { useAccount } from "wagmi";

interface ErrorToastProps {
  messageToShow: string;
  messageToCopy?: string;
}

const ErrorToast: FC<ErrorToastProps> = ({ messageToShow, messageToCopy }) => {
  const url = useUrl();
  const { address } = useAccount();
  const [copySuccess, setCopySuccess] = useState(false);
  const bugReportLink = populateBugReportLink(url?.href ?? "", address ?? "", messageToCopy ?? "");

  const copyToClipboard = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!messageToCopy) return;

    try {
      await navigator.clipboard.writeText(messageToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex gap-4 items-center pl-3 md:pl-6">
      <Image className="hidden md:block" src="/toast/sadboi.png" width={40} height={40} alt="error" />
      <div className="flex flex-col gap-4 pl-1">
        <div className="flex flex-col max-w-[350px] md:max-w-full">
          <p className="text-[14px] font-medium">{messageToShow}</p>
          {messageToCopy && (
            <p className="text-[10px]">
              Note: The issue might be with your wallet or browser—please consider trying different ones if possible.
            </p>
          )}
        </div>
        {messageToCopy ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 items-center">
              <ClipboardIcon className="w-4 h-4" />
              <p
                className="text-[10px] text-true-black uppercase hover:text-neutral-0 cursor-pointer"
                onClick={copyToClipboard}
              >
                {copySuccess ? "Copied!" : "copy full error details"}
              </p>
            </div>
            <a
              href={bugReportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 items-center cursor-pointer"
              onClick={e => e.stopPropagation()}
            >
              <FlagIcon className="w-4 h-4" />
              <p className="text-[11px] text-true-black uppercase font-bold hover:text-neutral-0">
                please file a <span className="underline uppercase text-secondary-5">bug report</span> so we can look
                into this
              </p>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorToast;
