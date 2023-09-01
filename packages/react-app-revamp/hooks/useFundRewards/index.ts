import { toastError } from "@components/UI/Toast";
import useRewardsModule from "@hooks/useRewards";
import { prepareSendTransaction, sendTransaction, waitForTransaction, writeContract } from "@wagmi/core";
import { utils } from "ethers";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { useRouter } from "next/router";
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
  const { asPath } = useRouter();
  const [chainName, contestAddress] = asPath.split("/").slice(2, 4);
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
  const { refetchBalanceRewardsModule } = useRewardsModule();

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
    decimals: number;
  }) => {
    const { currentUserAddress, tokenAddress, amount, isErc20, rewardsContractAddress, decimals } = args;
    const contractConfig = {
      address: tokenAddress as `0x${string}`,
      abi: erc20ABI,
    };

    setIsLoading(true);
    setIsSuccess(false);

    let txSendFunds;
    let receipt;
    if (isErc20) {
      const amountBigInt = BigInt(amount);

      txSendFunds = await writeContract({
        ...contractConfig,
        functionName: "transfer",
        args: [rewardsContractAddress as `0x${string}`, amountBigInt],
      });

      receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txSendFunds.hash,
      });

      await refetchBalanceRewardsModule();
    } else {
      const amountBigInt = BigInt(amount);

      const config = prepareSendTransaction({
        to: rewardsContractAddress as `0x${string}`,
        value: amountBigInt,
      });

      const { hash } = await sendTransaction(await config);

      receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: hash,
      });
    }

    setIsLoading(false);
    setIsSuccess(true);

    updateRewardAnalytics({
      contest_address: contestAddress,
      rewards_module_address: rewardsContractAddress,
      network_name: chainName,
      amount: parseFloat(utils.formatUnits(amount, decimals)),
      operation: "deposit",
      token_address: tokenAddress?.startsWith("$") ? null : tokenAddress,
    });

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
  }, [isModalOpen, setError, setIsLoading, setIsSuccess, setTransactionData]);

  return {
    sendFundsToRewardsModuleV3,
    isLoading,
    error,
    isSuccess,
    transactionData,
  };
}

export default useFundRewardsModule;
