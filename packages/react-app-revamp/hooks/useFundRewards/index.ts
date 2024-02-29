import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import useRewardsModule from "@hooks/useRewards";
import {
  estimateGas,
  sendTransaction,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
  type WaitForTransactionReceiptReturnType,
} from "@wagmi/core";
import { utils } from "ethers";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";
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
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const { chain } = useAccount();
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
  const { error: errorMessage, handleError } = useError();
  const { handleRefetchBalanceRewardsModule } = useRewardsModule();

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
            handleError(e, `Something went wrong while sending funds for reward ${reward}.`);
            setError(errorMessage);
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
    const { tokenAddress, amount, isErc20, rewardsContractAddress, decimals } = args;
    const contractConfig = {
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
    };

    setIsLoading(true);
    setIsSuccess(false);

    let hash: `0x${string}`;
    let receipt: WaitForTransactionReceiptReturnType;

    if (isErc20) {
      const amountBigInt = BigInt(amount);

      const { request } = await simulateContract(config, {
        ...contractConfig,
        functionName: "transfer",
        args: [rewardsContractAddress as `0x${string}`, amountBigInt],
      });

      hash = await writeContract(config, {
        ...request,
      });

      receipt = await waitForTransactionReceipt(config, {
        chainId: chainId,
        hash: hash,
      });

      handleRefetchBalanceRewardsModule();
    } else {
      const amountBigInt = BigInt(amount);

      await estimateGas(config, {
        to: rewardsContractAddress as `0x${string}`,
        value: amountBigInt,
      });

      const hash = await sendTransaction(config, {
        to: rewardsContractAddress as `0x${string}`,
        value: amountBigInt,
      });

      receipt = await waitForTransactionReceipt(config, {
        chainId: chainId,
        hash: hash,
      });
    }

    setIsLoading(false);
    setIsSuccess(true);

    handleRefetchBalanceRewardsModule();
    updateRewardAnalytics({
      contest_address: contestAddress,
      rewards_module_address: rewardsContractAddress,
      network_name: chainName,
      amount: parseFloat(utils.formatUnits(amount, decimals)),
      operation: "deposit",
      token_address: tokenAddress?.startsWith("$") ? null : tokenAddress,
      created_at: Math.floor(Date.now() / 1000),
    });

    return {
      hash: receipt.transactionHash,
      chainId: chainId,
      transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${receipt.transactionHash}`,
    };
  };

  useEffect(() => {
    if (!isModalOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setTransactionData({});
      setError("");
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
