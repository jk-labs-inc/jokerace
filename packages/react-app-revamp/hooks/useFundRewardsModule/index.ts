import { waitForTransaction, writeContract } from "@wagmi/core";
import toast from "react-hot-toast";
import { useNetwork, erc20ABI } from "wagmi";
import { useStore as useStoreRewardsModule } from "@hooks/useRewardsModule/store";
import { useEffect } from "react";
import { useStore } from "./store";

export function useFundRewardsModule() {
  const { chain } = useNetwork();
  const {
    //@ts-ignore
    isModalOpen,
    //@ts-ignore
    isLoading,
    //@ts-ignore
    isError,
    //@ts-ignore
    error,
    //@ts-ignore
    isSuccess,
    //@ts-ignore
    transactionData,
    //@ts-ignore
    setIsLoading,
    //@ts-ignore
    setIsSuccess,
    //@ts-ignore
    setIsError,
    //@ts-ignore
    setTransactionData,
  } = useStore();
  //@ts-ignore
  const { rewardsModule } = useStoreRewardsModule();
  async function sendFundsToRewardsModule(args: {
    currentUserAddress: string;
    erc20TokenAddress: string;
    amount: string;
  }) {
    const { erc20TokenAddress, amount } = args;
    setIsLoading(true);
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false, null);
    setTransactionData(null);
    const contractConfig = {
      addressOrName: erc20TokenAddress,
      contractInterface: erc20ABI,
    };
    try {
      const txSendFunds = await writeContract({
        ...contractConfig,
        functionName: "transfer",
        args: [rewardsModule.contractAddress, amount],
      });
      const receipt = await waitForTransaction({
        chainId: chain?.id,
        //@ts-ignore
        hash: txSendFunds.hash,
      });
      setTransactionData({
        hash: receipt.transactionHash,
        chainId: chain?.id,
        //@ts-ignore
        transactionHref: `${chain.blockExplorers?.default?.url}/tx/${txSendFunds?.hash}`,
      });
      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Funds sent to the rewards module successfully !`);
    } catch (e) {
      toast.error(
        //@ts-ignore
        e?.data?.message ?? "Something went wrong while sending funds to the rewards module.",
      );
      console.error(e);
      setIsLoading(false);
      //@ts-ignore
      setIsError(true, e?.data?.message ?? "Something went wrong while sending funds to the rewards module.");
    }
  }

  useEffect(() => {
    if (isModalOpen === false) {
      setIsLoading(false);
      setIsSuccess(false);
      setTransactionData({});
      setIsError(false, null);
    }
  }, [isModalOpen]);

  return {
    sendFundsToRewardsModule,
    isLoading,
    isError,
    error,
    isSuccess,
    transactionData,
  };
}

export default useFundRewardsModule;
