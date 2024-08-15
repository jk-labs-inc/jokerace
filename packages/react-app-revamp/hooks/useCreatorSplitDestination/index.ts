import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { SplitFeeDestination } from "@hooks/useDeployContest/types";
import { useError } from "@hooks/useError";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SetCreatorSplitDestinationResult {
  setCreatorSplitDestination: (splitFeeDestination: SplitFeeDestination) => Promise<void>;
  isLoading: boolean;
  isConfirmed: boolean;
}

export function useCreatorSplitDestination(): SetCreatorSplitDestinationResult {
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.find(chain => chain.name === chainName)?.id;
  const { contestAbi: abi, setCharge, charge } = useContestStore(state => state);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { handleError } = useError();

  const setCreatorSplitDestination = async (splitFeeDestination: SplitFeeDestination): Promise<void> => {
    if (!splitFeeDestination.address || !charge) return;
    setIsLoading(true);
    setIsConfirmed(false);
    toastLoading("Setting creator split destination...");

    try {
      const { request } = await simulateContract(config, {
        chainId,
        abi,
        address: address as `0x${string}`,
        functionName: "setCreatorSplitDestination",
        args: [splitFeeDestination.address],
      });

      const txHash = await writeContract(config, request);
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      if (receipt.status === "success") {
        setIsConfirmed(true);
        toastSuccess("Creator split destination set successfully");
        setCharge({
          ...charge,
          splitFeeDestination,
        });
      }
    } catch (err: any) {
      handleError(err, "An error occurred while setting creator split destination");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setCreatorSplitDestination,
    isLoading,
    isConfirmed,
  };
}
