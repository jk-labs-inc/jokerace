import { populateBugReportLink } from "@helpers/githubIssue";
import { useUrl } from "nextjs-current-url";
import { FC, ReactNode, useState } from "react";
import { useConnection } from "wagmi";
import ErrorToastClassic from "./components/ErrorClassic";
import ErrorToastSimple from "./components/ErrorSimple";
import ErrorToastWithAdditionalMessage from "./components/ErrorWithAdditionalMessage";
import WarningToast from "../Warning";

export enum ErrorToastType {
  SIMPLE = "simple",
  ADVANCED = "advanced",
}

interface ErrorToastProps {
  messageToShow: string;
  messageToCopy?: string;
  additionalMessage?: ReactNode;
  type?: ErrorToastType;
  codeFound?: boolean;
}

const ErrorToast: FC<ErrorToastProps> = ({
  messageToShow,
  messageToCopy,
  additionalMessage,
  type = ErrorToastType.ADVANCED,
  codeFound,
}) => {
  const url = useUrl();
  const { address } = useConnection();
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

  // We use this only in case when we know that there is not a point of opening a bug report (e.g. price changed and any other error that we consider as a user error)
  if (additionalMessage) {
    return <ErrorToastWithAdditionalMessage message={messageToShow} additionalMessage={additionalMessage} />;
  }

  if (type === ErrorToastType.SIMPLE) {
    return <ErrorToastSimple message={messageToShow} />;
  }

  return (
    <ErrorToastClassic
      message={messageToShow}
      messageToCopy={messageToCopy}
      bugReportLink={bugReportLink}
      copyToClipboard={copyToClipboard}
      copySuccess={copySuccess}
    />
  );
};

export default ErrorToast;
