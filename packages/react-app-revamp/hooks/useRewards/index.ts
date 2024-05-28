import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { useError } from "@hooks/useError";
import useUnpaidRewardTokens from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { readContract, readContracts } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useRewardsStore } from "./store";
import { useContestStore } from "@hooks/useContest/store";

export function useRewardsModule() {
  const asPath = usePathname();
  const { rewardsModuleAddress, rewardsAbi } = useContestStore(state => state);
  const { chainName: contestChainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { chain } = useAccount();
  const { rewards, setRewards, setIsLoading, setError, setIsSuccess } = useRewardsStore(state => state);
  const { error, handleError } = useError();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName.toLowerCase(),
  )?.[0]?.id;
  const { refetchUnpaidTokens } = useUnpaidRewardTokens("rewards-module-unpaid-tokens", rewards?.contractAddress);

  const handleRefetchBalanceRewardsModule = () => {
    refetchUnpaidTokens();
  };

  async function getContestRewardsModule() {
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    if (rewardsAbi === null) {
      setIsLoading(false);
      setIsSuccess(false);
      toastError(`This contract doesn't exist on ${contestChainName}.`);
      return;
    }

    try {
      const configRewardsModuleContract = {
        address: rewardsModuleAddress as `0x${string}`,
        abi: rewardsAbi as Abi,
        chainId,
      };
      const contractsRewardsModule = [
        {
          ...configRewardsModuleContract,
          functionName: "creator",
        },
        {
          ...configRewardsModuleContract,
          functionName: "getPayees",
        },
        {
          ...configRewardsModuleContract,
          functionName: "totalShares",
        },
      ];

      const rewardsModule = await readContracts(config, {
        contracts: contractsRewardsModule,
      });

      setRewards({
        abi: rewardsAbi,
        contractAddress: rewardsModuleAddress,
        creator: rewardsModule[0],
        payees: rewardsModule[1].result,
        totalShares: rewardsModule[2].result,
        blockExplorers: chains.filter(
          (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName,
        )?.[0]?.blockExplorers?.default,
      });
      setIsLoading(false);
      setIsSuccess(true);
    } catch (e) {
      handleError(e, "Something went wrong and the rewards module couldn't be retrieved.");
      setError(error);
      setIsLoading(false);
      setIsSuccess(false);
    }
  }

  async function getContestRewardsAddress() {
    const { abi: abiContest } = await getContestContractVersion(contestAddress, chainId);

    if (abiContest === null) {
      setIsLoading(false);
      setIsSuccess(false);
      toastError(`This contract doesn't exist on ${contestChainName}.`);
      return;
    }

    try {
      const contestRewardModuleAddress = (await readContract(config, {
        address: contestAddress as `0x${string}`,
        abi: abiContest as Abi,
        chainId,
        functionName: "officialRewardsModule",
      })) as string;

      return contestRewardModuleAddress;
    } catch (error) {
      handleError(error, "failed to fetch rewards module address.");
      return;
    }
  }

  return {
    getContestRewardsModule,
    getContestRewardsAddress,
    handleRefetchBalanceRewardsModule,
  };
}

export default useRewardsModule;
