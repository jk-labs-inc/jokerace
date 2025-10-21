import { ClipboardIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface ErrorToastClassicProps {
  message: string;
  bugReportLink: string;
  copySuccess: boolean;
  messageToCopy?: string;
  copyToClipboard?: (event: React.MouseEvent) => void;
}

const ErrorToastClassic: FC<ErrorToastClassicProps> = ({
  message,
  messageToCopy,
  bugReportLink,
  copyToClipboard,
  copySuccess,
}) => {
  return (
    <div className="flex gap-4 items-center pl-3 md:pl-6">
      <img className="hidden md:block" src="/toast/sadboi.png" width={40} height={40} alt="error" />
      <div className="flex flex-col gap-4 pl-1">
        <div className="flex gap-1 flex-col max-w-[350px] md:max-w-full">
          <p className="text-[14px] font-medium">{message}</p>
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

export default ErrorToastClassic;
