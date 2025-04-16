import { populateBugReportLink } from "@helpers/githubIssue";
import { ClipboardIcon } from "@heroicons/react/24/outline";
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
      <img className="hidden md:block" src="/toast/sadboi.png" width={40} height={40} alt="error" />
      <div className="flex flex-col gap-4 pl-1">
        <div className="flex gap-1 flex-col max-w-[350px] md:max-w-full">
          <p className="text-[14px] font-medium">{messageToShow}</p>
          <p className="text-[11px]">
            note: retry with a different wallet and browser. you can file a bug report{" "}
            <a
              href={bugReportLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="underline uppercase text-secondary-5"
            >
              here
            </a>
          </p>
        </div>
        {messageToCopy ? (
          <div className="flex gap-1 items-center">
            <ClipboardIcon className="w-4 h-4" />
            <p
              className="text-[11px] text-true-black uppercase hover:text-neutral-0 cursor-pointer"
              onClick={copyToClipboard}
            >
              {copySuccess ? "Copied!" : "copy full error details"}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorToast;
