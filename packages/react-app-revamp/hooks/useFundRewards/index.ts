import { toastError } from "@components/UI/Toast";
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

  const sendFundsToRewardsModuleV3 = ({ rewards }: any) => {
    if (rewards.length > 3) {
      toast.warning("number of rewards cannot be more than 3 in one take.");
      return;
    }
    const promises = rewards.map((reward: any) => {
      return () =>
        sendFundsToSingleReward(reward)
          .then(async result => {
            setTransactionData((prevData: any) => [...prevData, result]);
          })
          .catch(e => {
            const customError = e as CustomError;
            const message = customError.message || `Something went wrong while sending funds for reward ${reward}.`;
            toastError(`Something went wrong while sending funds for reward.`, customError.message);
            setError({
              code: customError.code,
              message,
            });
            setIsSuccess(false);
            setIsLoading(false);
            throw e;
          });
    });
    return promises;
  };

  const sendFundsToSingleReward = async (args: {
    currentUserAddress: string;
    tokenAddress: string | null;
    isErc20: boolean;
    amount: string;
    rewardsContractAddress: string;
  }) => {
    const { currentUserAddress, tokenAddress, amount, isErc20, rewardsContractAddress } = args;
    const contractConfig = {
      addressOrName: tokenAddress ?? "",
      contractInterface: erc20ABI,
    };

    setIsLoading(true);
    setIsSuccess(false);

    let txSendFunds;
    let receipt;
    if (isErc20) {
      txSendFunds = await writeContract({
        ...contractConfig,
        functionName: "transfer",
        args: [rewardsContractAddress, amount],
      });
      receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txSendFunds.hash,
      });

      await queryClient.invalidateQueries({
        queryKey: ["balance-rewards-module", rewardsContractAddress],
        exact: true,
        refetchType: "active",
      });
    } else {
      txSendFunds = await sendTransaction({
        chainId: chain?.id,
        request: {
          from: currentUserAddress,
          to: rewardsContractAddress,
          value: amount,
        },
      });

      receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txSendFunds.hash,
      });
    }

    setIsLoading(false);
    setIsSuccess(true);

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
    sendFundsToRewardsModuleV3,
    isLoading,
    error,
    isSuccess,
    transactionData,
  };
}

export default useFundRewardsModule;
