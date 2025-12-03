import { toastDismiss, toastError, toastWarning } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { didUserReject, handleError as handleUtilityError } from "utils/error";
import { useAccount } from "wagmi";

export function useError() {
  const location = useLocation();
  const pathname = location.pathname;
  const { chainName: chainNameFromPath } = extractPathSegments(pathname);
  const { chain: chainFromAccount } = useAccount();
  const [error, setError] = useState<string>("");

  const handleError = (e: any, defaultMessage: string) => {
    if (didUserReject(e)) {
      toastDismiss();
      return;
    }

    const chainName = resolveChainName(chainNameFromPath);

    const handledError = handleUtilityError(e, chainName);

    setError(handledError.message);

    if (handledError.isWarning) {
      return toastWarning({
        message: handledError.message,
        additionalMessage: handledError.additionalMessage,
      });
    }

    if (handledError.codeFound) {
      toastError({
        message: handledError.message,
        additionalMessage: handledError.additionalMessage,
        codeFound: true,
      });
    } else {
      toastError({
        message: defaultMessage,
        messageToCopy: handledError.message,
      });
    }
  };

  const resolveChainName = (chainName: string) => {
    if (chainName !== chains.filter(chain => chain.name.toLowerCase() === chainName.toLowerCase())[0]?.name) {
      return chainFromAccount?.name ?? "";
    }
    return chainName;
  };

  return { error, handleError };
}
