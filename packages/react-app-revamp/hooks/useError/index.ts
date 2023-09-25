import { toastDismiss, toastError } from "@components/UI/Toast";
import { useState } from "react";
import { didUserReject, handleError as handleUtilityError } from "utils/error";

export function useError() {
  const [error, setError] = useState<string>("");

  const handleError = (e: unknown, defaultMessage: string) => {
    if (didUserReject(e)) {
      toastDismiss();
      return;
    }

    const handledError = handleUtilityError(e);
    setError(handledError.message);

    if (handledError.codeFound) {
      toastError(handledError.message);
    } else {
      toastError(defaultMessage, handledError.message);
    }
  };

  return { error, handleError };
}
