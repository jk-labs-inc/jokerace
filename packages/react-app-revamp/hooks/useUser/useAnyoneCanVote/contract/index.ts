import { config } from "@config/wagmi";
import { readContract, readContracts } from "@wagmi/core";
import { Abi } from "viem";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import { ExponentialCurveData } from "../types";

/**
 * Fetch exponential curve configuration data from contract (batched call)
 * @param address - Contract address
 * @param abi - Contract ABI
 * @param chainId - Chain ID
 * @returns Promise<ExponentialCurveData>
 */
export const fetchExponentialCurveData = async (
  address: string,
  abi: Abi,
  chainId: number,
): Promise<ExponentialCurveData> => {
  try {
    const results = await readContracts(config, {
      contracts: [
        {
          address: address as `0x${string}`,
          abi: abi,
          chainId: chainId,
          functionName: "PRICE_CURVE_UPDATE_INTERVAL",
          args: [],
        },
        {
          address: address as `0x${string}`,
          abi: abi,
          chainId: chainId,
          functionName: "contestDeadline",
          args: [],
        },
        {
          address: address as `0x${string}`,
          abi: abi,
          chainId: chainId,
          functionName: "voteStart",
          args: [],
        },
      ],
    });

    const updateInterval = Number(results[0].result);
    const contestDeadline = Number(results[1].result);
    const voteStart = Number(results[2].result);

    return {
      updateInterval,
      contestDeadline,
      voteStart,
      isLoaded: true,
    };
  } catch (error) {
    console.error("Error fetching exponential curve data:", error);
    return {
      updateInterval: 0,
      contestDeadline: 0,
      voteStart: 0,
      isLoaded: false,
    };
  }
};

/**
 * Get the price curve type from the contract
 * @param address - Contract address
 * @param abi - Contract ABI
 * @param chainId - Chain ID
 * @returns Promise<PriceCurveType | null> - The price curve type or null if error
 */
export const getPriceCurveType = async (address: string, abi: Abi, chainId: number): Promise<PriceCurveType | null> => {
  try {
    const priceCurveTypeRaw = (await readContract(config, {
      address: address as `0x${string}`,
      abi: abi as Abi,
      chainId: chainId,
      functionName: "priceCurveType",
    })) as bigint;

    if (priceCurveTypeRaw === 0n) {
      return PriceCurveType.Flat;
    } else if (priceCurveTypeRaw === 1n) {
      return PriceCurveType.Exponential;
    }

    return PriceCurveType.Flat;
  } catch (error) {
    console.error("Error fetching price curve type:", error);
    return null;
  }
};
