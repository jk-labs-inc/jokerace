import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { readContracts } from "@wagmi/core";
import { getRewardsModuleAbi, getRewardsModuleAddress } from "lib/rewards";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { useRewardsStore } from "./store";

export function useRewardsModule() {
  const asPath = usePathname();
  const { rewardsModuleAddress, rewardsAbi, setRewardsModuleAddress, setRewardsAbi, contestAbi } = useContestStore(
    state => state,
  );
  const { chainName: contestChainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const { setRewards, setIsLoading, setError, setIsSuccess } = useRewardsStore(state => state);
  const { error, handleError } = useError();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName.toLowerCase(),
  )?.[0]?.id;

  const fetchRewardsModuleAbi = async (address: string) => {
    try {
      const contractConfig = {
        address: address as `0x${string}`,
        abi: contestAbi,
        chainId,
      };
      const abi = await getRewardsModuleAbi(contractConfig);
      return abi;
    } catch (e) {
      handleError(e, "Error fetching rewards module ABI");
      return null;
    }
  };

  const fetchRewardsModuleAddress = async (): Promise<string | null> => {
    try {
      if (!contestAbi) {
        setIsLoading(false);
        setIsSuccess(false);
        toastError(`This contract doesn't exist on ${contestChainName}.`);
        return null;
      }

      const contestRewardModuleAddress = await getRewardsModuleAddress({
        address: contestAddress as `0x${string}`,
        abi: contestAbi,
        chainId,
      });

      if (!contestRewardModuleAddress) {
        toastError("Invalid rewards module address.");
        return null;
      }

      return contestRewardModuleAddress;
    } catch (error) {
      handleError(error, "Failed to fetch rewards module address.");
      return null;
    }
  };

  async function getContestRewardsModule() {
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    let rewardsModuleAddressLocal: string | null = rewardsModuleAddress;
    let rewardsAbiLocal = rewardsAbi;

    // Fetch rewards module address if not available
    if (!rewardsModuleAddressLocal) {
      rewardsModuleAddressLocal = await fetchRewardsModuleAddress();
      if (!rewardsModuleAddressLocal) {
        setIsLoading(false);
        toastError(`Rewards module address not found on ${contestChainName}.`);
        return;
      }
      setRewardsModuleAddress(rewardsModuleAddressLocal);
    }

    // Fetch ABI if not available
    if (!rewardsAbiLocal) {
      rewardsAbiLocal = await fetchRewardsModuleAbi(rewardsModuleAddressLocal);

      if (!rewardsAbiLocal) {
        setIsLoading(false);
        toastError(`This contract doesn't exist on ${contestChainName}.`);
        return;
      }
      setRewardsAbi(rewardsAbiLocal);
    }

    try {
      const configRewardsModuleContract = {
        address: rewardsModuleAddressLocal as `0x${string}`,
        abi: rewardsAbiLocal as Abi,
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

      const creator = rewardsModule[0].result as string;
      const payees = rewardsModule[1].result as bigint[];
      const totalShares = rewardsModule[2].result as bigint;

      const formattedPayees = payees.map(payee => Number(payee));
      const totalSharesFormatted = Number(totalShares);

      setRewards({
        abi: rewardsAbiLocal,
        contractAddress: rewardsModuleAddressLocal,
        creator: creator,
        payees: formattedPayees,
        totalShares: totalSharesFormatted,
        blockExplorers: chains.filter(
          (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === contestChainName,
        )?.[0]?.blockExplorers?.default.url,
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

  return {
    getContestRewardsModule,
    fetchRewardsModuleAddress,
  };
}

export default useRewardsModule;
