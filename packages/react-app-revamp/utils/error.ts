import { ContractFunctionExecutionError, EstimateGasExecutionError } from "viem";

export enum ErrorCodes {
  CALL_EXCEPTION = "CALL_EXCEPTION",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  MISSING_NEW = "MISSING_NEW",
  NONCE_EXPIRED = "NONCE_EXPIRED",
  NUMERIC_FAULT = "NUMERIC_FAULT",
  REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED",
  TRANSACTION_REPLACED = "TRANSACTION_REPLACED",
  UNPREDICTABLE_GAS_LIMIT = "UNPREDICTABLE_GAS_LIMIT",
  EXECUTION_REVERTED = "EXECUTION_REVERTED",
  DUPLICATE_PROPOSAL = "DUPLICATE_PROPOSAL",
}

const errorMessages: { [key in ErrorCodes]?: string } = {
  [ErrorCodes.CALL_EXCEPTION]: "A contract call failed. Check the contract's conditions or requirements.",
  [ErrorCodes.INSUFFICIENT_FUNDS]: "You don't have enough funds for this transaction! Consider gas and data costs.",
  [ErrorCodes.MISSING_NEW]: "The 'new' keyword is missing in contract deployment.",
  [ErrorCodes.NONCE_EXPIRED]: "This nonce has been used before. Please try with a fresh nonce.",
  [ErrorCodes.NUMERIC_FAULT]: "A numeric operation resulted in an overflow or underflow.",
  [ErrorCodes.REPLACEMENT_UNDERPRICED]:
    "The new transaction's gas price is too low to replace the old one. Consider increasing it.",
  [ErrorCodes.TRANSACTION_REPLACED]:
    "This transaction was replaced by another with the same nonce, maybe due to a higher gas price.",
  [ErrorCodes.UNPREDICTABLE_GAS_LIMIT]:
    "Gas estimation failed. Consider setting a gas limit manually, or ensure the transaction is valid.",
  [ErrorCodes.EXECUTION_REVERTED]:
    "Execution reverted, which could be due to the function call failing its requirements or the transaction running out of gas.",
  [ErrorCodes.DUPLICATE_PROPOSAL]: "Duplicate proposals are not allowed. Please check your proposal details.",
};

function handleContractFunctionExecutionError(error: any): { message: string; codeFound: boolean } {
  if (error.message.includes("duplicate proposals not allowed")) {
    return { message: errorMessages[ErrorCodes.DUPLICATE_PROPOSAL]!, codeFound: true };
  }

  return { message: error.message, codeFound: false };
}

export function didUserReject(error: any): boolean {
  const errorCode = error?.code ?? error?.cause?.code;
  return errorCode === 4001 || errorCode === "ACTION_REJECTED" || error.includes("User rejected the request");
}

export function handleError(error: any): { message: string; codeFound: boolean } {
  const code = error.code as ErrorCodes;

  const isInsufficientFundsError =
    error instanceof EstimateGasExecutionError || (error.code === -32603 && error.data?.code === -32000);

  if (error instanceof ContractFunctionExecutionError) {
    return handleContractFunctionExecutionError(error);
  }

  if (isInsufficientFundsError) {
    return { message: errorMessages[ErrorCodes.INSUFFICIENT_FUNDS]!, codeFound: true };
  }

  // Check for revert reason ( for now out of gas )
  if (error.message && (error.message.includes("execution reverted") || error.message.includes("out of gas"))) {
    return { message: errorMessages[ErrorCodes.EXECUTION_REVERTED]!, codeFound: true };
  }

  if (code in errorMessages) {
    return { message: errorMessages[code]!, codeFound: true };
  }

  return { message: error.message ?? error.reason, codeFound: false };
}

export function isKnownErrorCodeMessage(message: string): boolean {
  return Object.values(errorMessages).includes(message);
}
