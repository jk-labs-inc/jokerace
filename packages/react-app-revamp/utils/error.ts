import { chains } from "@config/wagmi";
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
  [ErrorCodes.MISSING_NEW]: "The 'new' keyword is missing in contract deployment.",
  [ErrorCodes.NONCE_EXPIRED]: "This nonce has been used before. Please try with a fresh nonce.",
  [ErrorCodes.NUMERIC_FAULT]: "A numeric operation resulted in an overflow or underflow.",
  [ErrorCodes.REPLACEMENT_UNDERPRICED]:
    "The new transaction's gas price is too low to replace the old one. Consider increasing it.",
  [ErrorCodes.TRANSACTION_REPLACED]:
    "This transaction was replaced by another with the same nonce, maybe due to a higher gas price.",
  [ErrorCodes.UNPREDICTABLE_GAS_LIMIT]:
    "Gas estimation failed. Consider setting a gas limit manually, or ensure the transaction is valid.",
  [ErrorCodes.DUPLICATE_PROPOSAL]: "Duplicate proposals are not allowed. Please check your proposal details.",
};

const dynamicMessageCodes: readonly ErrorCodes[] = [ErrorCodes.EXECUTION_REVERTED, ErrorCodes.INSUFFICIENT_FUNDS];

function handleContractFunctionExecutionError(error: any): { message: string; codeFound: boolean } {
  if (error.message.includes("duplicate proposals not allowed")) {
    return { message: errorMessages[ErrorCodes.DUPLICATE_PROPOSAL]!, codeFound: true };
  }

  return { message: error.message, codeFound: false };
}

function customCodeMessage(code: ErrorCodes, error: any, chainName?: string) {
  if (dynamicMessageCodes.includes(code)) {
    const chainNativeCurrency = chains.find(
      chain => chain.name.toLowerCase() === chainName?.toLowerCase(),
    )?.nativeCurrency;

    if (chainNativeCurrency) {
      return {
        message: `please make sure you have enough ${chainNativeCurrency.symbol} on ${chainName}`,
        codeFound: true,
      };
    }
  }

  return { message: errorMessages[code]!, codeFound: true };
}

export function didUserReject(error: any): boolean {
  const errorCode = error?.code ?? error?.cause?.code;
  const errorMessage = error?.message ?? error?.cause?.message ?? "";

  return (
    errorCode === 4001 ||
    errorCode === "ACTION_REJECTED" ||
    errorMessage.toLowerCase().includes("user rejected") ||
    errorMessage.toLowerCase().includes("user denied")
  );
}

export function handleError(error: any, chainName?: string): { message: string; codeFound: boolean } {
  const code = error.code as ErrorCodes;

  // check for the specific insufficient funds error from simulation
  if (error.message && error.message.includes("insufficient funds for gas * price + value")) {
    return customCodeMessage(ErrorCodes.INSUFFICIENT_FUNDS, error, chainName);
  }

  const isInsufficientFundsError =
    error instanceof EstimateGasExecutionError || (error.code === -32603 && error.data?.code === -32000);

  if (error instanceof ContractFunctionExecutionError) {
    return handleContractFunctionExecutionError(error);
  }

  if (isInsufficientFundsError) {
    return customCodeMessage(ErrorCodes.INSUFFICIENT_FUNDS, error, chainName);
  }

  // check for revert reason
  if (error.message && (error.message.includes("execution reverted") || error.message.includes("out of gas"))) {
    return customCodeMessage(ErrorCodes.EXECUTION_REVERTED, error, chainName);
  }

  if (code in errorMessages || dynamicMessageCodes.includes(code)) {
    return customCodeMessage(code, error, chainName);
  }

  return { message: error.message ?? error.reason, codeFound: false };
}

export function isKnownErrorCodeMessage(message: string): boolean {
  return Object.values(errorMessages).includes(message);
}
