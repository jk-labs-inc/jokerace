import { toastError } from "@components/UI/Toast";
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
    rewardsContractAddress: string;
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

    try {
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

      toastError("Something went wrong while sending funds to the rewards module.", customError.message);
      setError({
        code: customError.code,
        message: customError.message,
      });
      setIsLoading(false);
    }
  }

  const sendFundsToRewardsModuleV3 = ({ rewards }: any) => {
    if (rewards.length > 3) {
      toast.warning("number of rewards cannot be more than 4 in one take.");
      return;
    }
    const promises = rewards.map((reward: any) => {
      return () =>
        sendFundsToSingleReward(reward)
          .then(result => {
            setTransactionData((prevData: any) => [...prevData, result]);
            setIsSuccess(true);
          })
          .catch(e => {
            const customError = e as CustomError;
            const message = customError.message || `Something went wrong while sending funds for reward ${reward}.`;
            toastError(`Something went wrong while sending funds for reward.`, customError.message);
            setError({
              code: customError.code,
              message,
            });
            setIsLoading(false);
            throw e; // This will stop the execution of the promises in case of error
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
