import { config } from "@config/wagmi";
import { getGasPrice, readContract } from "@wagmi/core";
import { fetchUserBalance } from "lib/fetchUserBalance";
import { Abi, parseEther } from "viem";
import { STANDARD_ANYONE_CAN_VOTE_GAS_LIMIT } from "../../utils";
import { UserVoteQualificationSetter } from "../types";

/**
 * Calculate user vote qualification based on balance, gas costs, and voting costs
 * @param address - Contract address
 * @param userAddress - User wallet address
 * @param chainId - Chain ID
 * @param abi - Contract ABI
 * @param voteCostFunctionName - Function name to call for getting vote cost ("costToVote" or "currentPricePerVote")
 * @param setUserVoteQualification - Function to set user vote qualification state
 * @returns Promise<void>
 */
export const calculateUserVoteQualification = async (
  address: string,
  userAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  voteCostFunctionName: "costToVote" | "currentPricePerVote",
  setUserVoteQualification: UserVoteQualificationSetter,
): Promise<void> => {
  try {
    const [userBalanceResult, gasPriceResult, costToVoteResult] = await Promise.all([
      fetchUserBalance(userAddress, chainId).catch(error => {
        return { value: 0n };
      }),
      getGasPrice(config, { chainId }).catch(error => {
        return 0n;
      }),
      readContract(config, {
        address: address as `0x${string}`,
        abi: abi as Abi,
        chainId: chainId,
        functionName: voteCostFunctionName,
      }).catch(error => {
        return 0n;
      }) as Promise<bigint>,
    ]);

    // Safety check for valid BigInt values
    if (!userBalanceResult.value || !gasPriceResult || !costToVoteResult) {
      setUserVoteQualification(0, 0, true, false, false);
      return;
    }

    if (userBalanceResult.value === 0n) {
      setUserVoteQualification(0, 0, true, false, false);
      return;
    }

    const totalGasCost = gasPriceResult * BigInt(STANDARD_ANYONE_CAN_VOTE_GAS_LIMIT);

    // Prevent negative values
    if (userBalanceResult.value <= totalGasCost || costToVoteResult === 0n) {
      setUserVoteQualification(0, 0, true, false, false);
      return;
    }

    const userVotesRaw = (userBalanceResult.value - totalGasCost) / costToVoteResult;
    const userVotesFormatted = Math.floor(Number(parseEther(userVotesRaw.toString())) / 1e18);

    // Check for valid number
    if (isNaN(userVotesFormatted)) {
      setUserVoteQualification(0, 0, false, false, true);
      return;
    }

    setUserVoteQualification(userVotesFormatted, userVotesFormatted, true, false, false);
  } catch (error) {
    console.error("Error in calculateUserVoteQualification:", error);
    setUserVoteQualification(0, 0, false, false, true);
  }
};
