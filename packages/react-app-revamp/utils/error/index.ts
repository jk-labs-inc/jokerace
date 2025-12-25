export type { ErrorResult, ErrorDefinition } from "./types";
export { ErrorCodes, errorDefinitions, dynamicMessageCodes, getErrorMessage } from "./codes";
export { handleGenericError, handleContractFunctionExecutionError } from "./handlers";

import { errorDefinitions, ErrorCodes } from "./codes";
import { handleGenericError } from "./handlers";
import { ErrorResult } from "./types";

/**
 * Main error handler - processes any error and returns a user-friendly message
 */
export const handleError = (error: any, chainName?: string): ErrorResult => {
  return handleGenericError(error, chainName);
};

export const didUserReject = (error: any): boolean => {
  const errorCode = error?.code ?? error?.cause?.code;
  const errorMessage = error?.message ?? error?.cause?.message ?? "";

  return (
    errorCode === 4001 ||
    errorCode === "ACTION_REJECTED" ||
    errorMessage.toLowerCase().includes("user rejected") ||
    errorMessage.toLowerCase().includes("user denied")
  );
};

export const isKnownErrorCodeMessage = (message: string): boolean => {
  return Object.values(errorDefinitions).some(def => def.message === message);
};

export const checkAndMarkPriceChangeError = (error: any, initialPrice: string | null, currentPrice: string): any => {
  if (initialPrice !== currentPrice) {
    return {
      ...error,
      code: ErrorCodes.PRICE_CHANGED,
      additionalMessage: `please tap "add votes" again to confirm updated prices`,
      originalError: error,
    };
  }

  return error;
};
