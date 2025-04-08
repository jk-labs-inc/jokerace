import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { useError } from "@hooks/useError";
import { FilteredToken } from "@hooks/useTokenList";
import {
  estimateGas,
  estimateMaxPriorityFeePerGas,
  sendTransaction,
  simulateContract,
  writeContract,
} from "@wagmi/core";
import { erc20Abi, parseUnits } from "viem";

interface UseSendTokenOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSendToken(options?: UseSendTokenOptions) {
  const { handleError } = useError();

  const transferERC20Token = async (
    chainId: number,
    to: `0x${string}`,
    amount: bigint,
    contractAddress: `0x${string}`,
  ) => {
    try {
      const { request } = await simulateContract(config, {
        abi: erc20Abi,
        chainId,
        address: contractAddress,
        functionName: "transfer",
        args: [to, amount],
      });

      toastLoading("sending transfer transaction...");
      const hash = await writeContract(config, request);

      toastSuccess("transfer transaction sent successfully!");
      options?.onSuccess?.();
      return hash;
    } catch (error) {
      handleError(error as Error, "transfer transaction failed");
    }
  };

  const sendToken = async (token: FilteredToken, chainId: number, recipientAddress: string, amount: string) => {
    if (!recipientAddress) {
      toastError("recipient address is required");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toastError("please enter a valid amount");
      return;
    }

    try {
      if (token.address === "0x0000000000000000000000000000000000000000") {
        const parsedAmount = parseUnits(amount, 18);

        try {
          toastLoading("preparing native token transaction...");

          const maxPriorityFeePerGas = await estimateMaxPriorityFeePerGas(config, {
            chainId,
          });

          const gasBuffer = maxPriorityFeePerGas * 100000n;

          const adjustedAmount = parsedAmount > gasBuffer ? parsedAmount - gasBuffer : 0n;

          if (adjustedAmount <= 0n) {
            toastError("amount too small to cover gas fees");
            return;
          }

          toastLoading("sending native token transaction...");
          const hash = await sendTransaction(config, {
            to: recipientAddress as `0x${string}`,
            value: adjustedAmount,
          });

          toastSuccess("transaction sent successfully!");
          options?.onSuccess?.();
          return hash;
        } catch (error) {
          const err = error as Error;
          toastError(err.message || "transaction failed");
          options?.onError?.(err);
          throw error;
        }
      } else {
        toastLoading("preparing token transfer...");

        const parsedAmount = parseUnits(amount, token.decimals);

        return await transferERC20Token(
          chainId,
          recipientAddress as `0x${string}`,
          parsedAmount,
          token.address as `0x${string}`,
        );
      }
    } catch (e) {
      handleError(e as Error, "transaction failed");
    }
  };

  return {
    sendToken,
  };
}
