export enum ErrorCodes {
  CALL_EXCEPTION = "CALL_EXCEPTION",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  MISSING_NEW = "MISSING_NEW",
  NONCE_EXPIRED = "NONCE_EXPIRED",
  NUMERIC_FAULT = "NUMERIC_FAULT",
  REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED",
  TRANSACTION_REPLACED = "TRANSACTION_REPLACED",
  UNPREDICTABLE_GAS_LIMIT = "UNPREDICTABLE_GAS_LIMIT",
}

const errorMessages: { [key in ErrorCodes]?: string } = {
  [ErrorCodes.CALL_EXCEPTION]: "A contract call failed. Check the contract's conditions or requirements.",
  [ErrorCodes.INSUFFICIENT_FUNDS]: "You don't have enough funds for this transaction. Consider gas and data costs.",
  [ErrorCodes.NONCE_EXPIRED]: "This nonce has been used before. Please try with a fresh nonce.",
  [ErrorCodes.REPLACEMENT_UNDERPRICED]:
    "The new transaction's gas price is too low to replace the old one. Consider increasing it.",
  [ErrorCodes.TRANSACTION_REPLACED]:
    "This transaction was replaced by another with the same nonce, maybe due to a higher gas price.",
  [ErrorCodes.UNPREDICTABLE_GAS_LIMIT]:
    "Gas estimation failed. Consider setting a gas limit manually, or ensure the transaction is valid.",
};

export function didUserReject(error: any): boolean {
  const errorCode = error?.code ?? error?.cause?.code;
  return errorCode === 4001 || errorCode === "ACTION_REJECTED";
}

export function handleError(error: any): { message: string; codeFound: boolean } {
  const code = error.code as ErrorCodes;

  if (code in errorMessages) {
    return { message: errorMessages[code]!, codeFound: true };
  }

  return { message: error.message, codeFound: false };
}

export function isKnownErrorCodeMessage(message: string): boolean {
  return Object.values(errorMessages).includes(message);
}
