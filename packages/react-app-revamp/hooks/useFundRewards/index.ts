import { useRewardsStore } from "@hooks/useRewards/store";
import { useQueryClient } from "@tanstack/react-query";
import { sendTransaction, waitForTransaction, writeContract } from "@wagmi/core";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { erc20ABI, useNetwork } from "wagmi";
import { useFundRewardsStore } from "./store";

export interface RewardData {
  currentUserAddress: string;
  tokenAddress: string | null;
  isErc20: boolean;
  amount: string;
  rewardsContractAddress?: string;
}

export function useFundRewardsModule() {
  const queryClient = useQueryClient();
  const { chain } = useNetwork();
  const {
    isModalOpen,
    isLoading,
    error,
    isSuccess,
    transactionData,
    setIsLoading,
    setIsSuccess,
    setError,
    setTransactionData,
  } = useFundRewardsStore(state => state);
  const { rewards } = useRewardsStore(state => state);

  async function sendFundsToRewardsModule(args: {
    currentUserAddress: string;
    tokenAddress: string | null;
    isErc20: boolean;
    amount: string;
    rewardsContractAddress?: string;
  }) {
    const { currentUserAddress, tokenAddress, amount, isErc20, rewardsContractAddress } = args;
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      addressOrName: tokenAddress ?? "",
      contractInterface: erc20ABI,
    };
    const rewardsAddress = rewardsContractAddress ? rewardsContractAddress : rewards.contractAddress;
    try {
      let txSendFunds;
      let receipt;
      if (isErc20) {
        txSendFunds = await writeContract({
          ...contractConfig,
          functionName: "transfer",
          args: [rewardsAddress, amount],
        });
        receipt = await waitForTransaction({
          chainId: chain?.id,
          hash: txSendFunds.hash,
        });
      } else {
        txSendFunds = await sendTransaction({
          chainId: chain?.id,
          request: {
            from: currentUserAddress,
            to: rewardsAddress,
            value: amount,
          },
        });

        receipt = await waitForTransaction({
          chainId: chain?.id,
          hash: txSendFunds.hash,
        });
      }

      setTransactionData({
        hash: receipt.transactionHash,
        chainId: chain?.id,
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txSendFunds?.hash}`,
      });

      await queryClient.invalidateQueries({
        queryKey: ["balance-rewards-module", rewards?.contractAddress],
        exact: true,
        refetchType: "active",
      });

      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Funds sent to the rewards module successfully !`);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      const message = customError.message || "Something went wrong while sending funds to the rewards module.";
      toast.error(message);
      setError({
        code: customError.code,
        message,
      });
      setIsLoading(false);
    }
  }

  const sendFundsToRewardsModuleV3 = async ({ rewards }: any) => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);

    const results = [];

    for (let i = 0; i < rewards.length; i++) {
      try {
        const resultPromise = sendFundsToSingleReward(rewards[i]);
        const result = await toast.promise(resultPromise, {
          pending: `Funding pool ${i + 1}/${rewards.length}...`,
          success: `Funds sent successfully!`,
          error: `Something went wrong while sending funds for reward ${i + 1}.`,
        });
        results.push(result);
      } catch (e) {
        const customError = e as CustomError;
        const message = customError.message || `Something went wrong while sending funds for reward ${i + 1}.`;
        toast.error(message);
        setError({
          code: customError.code,
          message,
        });
        setIsLoading(false);
        return; // Stop sending if an error occurs
      }
    }

    setTransactionData(results);
    setIsLoading(false);
    setIsSuccess(true);
  };

  const sendFundsToSingleReward = async (args: {
    currentUserAddress: string;
    tokenAddress: string | null;
    isErc20: boolean;
    amount: string;
    rewardsContractAddress?: string;
  }) => {
    const { currentUserAddress, tokenAddress, amount, isErc20, rewardsContractAddress } = args;
    const contractConfig = {
      addressOrName: tokenAddress ?? "",
      contractInterface: erc20ABI,
    };
    const rewardsAddress = rewardsContractAddress ? rewardsContractAddress : rewards.contractAddress;
    let txSendFunds;
    let receipt;
    if (isErc20) {
      txSendFunds = await writeContract({
        ...contractConfig,
        functionName: "transfer",
        args: [rewardsAddress, amount],
      });
      receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txSendFunds.hash,
      });
    } else {
      txSendFunds = await sendTransaction({
        chainId: chain?.id,
        request: {
          from: currentUserAddress,
          to: rewardsAddress,
          value: amount,
        },
      });

      receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txSendFunds.hash,
      });
    }

    return {
      hash: receipt.transactionHash,
      chainId: chain?.id,
      transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txSendFunds?.hash}`,
    };
  };

  useEffect(() => {
    if (!isModalOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setTransactionData({});
      setError(null);
    }
  }, [isModalOpen]);

  return {
    sendFundsToRewardsModule,
    sendFundsToRewardsModuleV3,
    isLoading,
    error,
    isSuccess,
    transactionData,
  };
}

export default useFundRewardsModule;
