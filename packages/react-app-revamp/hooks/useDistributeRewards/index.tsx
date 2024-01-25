import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useError } from "@hooks/useError";
import { useTokenDecimals } from "@hooks/useTokenDecimals";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { useRouter } from "next/router";
import { formatEther, formatUnits } from "viem";
import { useBalance } from "wagmi";
import { create } from "zustand";

type TokenType = "erc20" | "native";

type Store = {
  isReleasableRewardsLoading: boolean;
  isReleasedRewardsLoading: boolean;
  isDistributeRewardsLoading: boolean;
  setIsDistributeRewardsLoading: (isLoading: boolean) => void;
  setIsReleasedRewardsLoading: (isReleasedRewardsLoading: boolean) => void;
  setIsReleasableRewardsLoading: (isReleasableRewardsLoading: boolean) => void;
};

export const useDistributeRewardStore = create<Store>(set => ({
  isReleasableRewardsLoading: false,
  isReleasedRewardsLoading: false,
  isDistributeRewardsLoading: false,
  setIsDistributeRewardsLoading: (isLoading: boolean) => set({ isDistributeRewardsLoading: isLoading }),
  setIsReleasedRewardsLoading: (isReleasedRewardsLoading: boolean) => set({ isReleasedRewardsLoading }),
  setIsReleasableRewardsLoading: (isReleasableRewardsLoading: boolean) => set({ isReleasableRewardsLoading }),
}));

export const useDistributeRewards = (
  payee: number,
  share: any,
  contractRewardsModuleAddress: string,
  abiRewardsModule: any,
  chainId: number,
  tokenType: TokenType,
  tokenAddress?: string,
) => {
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const { setIsReleasableRewardsLoading, setIsReleasedRewardsLoading, setIsDistributeRewardsLoading } =
    useDistributeRewardStore(state => state);
  const tokenResData = useTokenDecimals(tokenAddress as `0x${string}`, chainId);
  const tokenData = tokenType === "erc20" ? tokenResData : null;
  const { handleError } = useError();
  const queryTokenBalance = useBalance({
    address: contractRewardsModuleAddress as `0x${string}`,
    chainId,
    token: tokenType === "erc20" ? (tokenAddress as `0x${string}`) : undefined,
  });

  const transform = (data: unknown[]) => {
    const amount = data as unknown as bigint;

    return tokenType === "erc20"
      ? parseFloat(formatUnits(amount, tokenData?.decimals ?? 18))
      : parseFloat(formatEther(amount));
  };

  const queryRankRewardsReleasable = async () => {
    setIsReleasableRewardsLoading(true);

    return await readContract(config, {
      address: contractRewardsModuleAddress as `0x${string}`,
      abi: abiRewardsModule,
      chainId,
      functionName: "releasable",
      args: tokenType === "erc20" ? [tokenAddress ?? "", payee] : [payee],
    })
      .then((data: any) => {
        setIsReleasableRewardsLoading(false);
        return transform(data);
      })
      .catch((error: any) => {
        setIsReleasableRewardsLoading(false);
        handleError(error, "Error while querying releasable rewards");
      });
  };

  const queryRankRewardsReleased = async () => {
    setIsReleasedRewardsLoading(true);
    return await readContract(config, {
      address: contractRewardsModuleAddress as `0x${string}`,
      abi: abiRewardsModule,
      chainId,
      functionName: tokenType === "erc20" ? "erc20Released" : "released",
      args: tokenType === "erc20" ? [tokenAddress ?? "", payee] : [payee],
    })
      .then((data: any) => {
        setIsReleasedRewardsLoading(false);
        return transform(data);
      })
      .catch((error: any) => {
        setIsReleasedRewardsLoading(false);
        handleError(error, "Error while querying released rewards");
      });
  };

  const handleDistributeRewards = async () => {
    setIsDistributeRewardsLoading(true);
    toastLoading(`Distributing funds...`);
    try {
      const hash = await writeContract(config, {
        address: contractRewardsModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        functionName: "release",
        args: tokenType === "erc20" ? [tokenAddress ?? "", payee] : [payee],
        chainId,
      });

      await waitForTransactionReceipt(config, { hash });

      await queryTokenBalance.refetch();
      await queryRankRewardsReleasable();
      const amountReleased = await queryRankRewardsReleased();

      setIsDistributeRewardsLoading(false);
      toastSuccess("Funds distributed successfully!");

      updateRewardAnalytics({
        contest_address: contestAddress,
        rewards_module_address: contractRewardsModuleAddress,
        network_name: chainName,
        amount: amountReleased ?? 0,
        operation: "distribute",
        token_address: tokenAddress ? tokenAddress : null,
        created_at: Math.floor(Date.now() / 1000),
      });
    } catch (error) {
      handleError(error, "Error while releasing token");
      setIsDistributeRewardsLoading(false);
    }
  };

  return {
    share,
    chainId,
    queryTokenBalance,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    handleDistributeRewards,
  };
};
