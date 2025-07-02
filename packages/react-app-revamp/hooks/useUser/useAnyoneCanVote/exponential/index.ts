import { RefObject } from "react";
import { Abi } from "viem";
import { calculateUserVoteQualification } from "../qualification";
import { ExponentialCurveData, UserVoteQualificationSetter } from "../types";
import { calculateCycleInfo, hasVotingEnded, shouldUpdateVotes } from "../utils";

/**
 * Set up periodic updates for exponential price curves
 * @param address - Contract address
 * @param userAddress - User wallet address
 * @param chainId - Chain ID
 * @param abi - Contract ABI
 * @param curveData - Exponential curve configuration data
 * @param setUserVoteQualification - Function to update user vote qualification
 * @param updateIntervalRef - Ref to store the interval timer
 */
export const setupExponentialUpdates = (
  address: string,
  userAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  curveData: ExponentialCurveData,
  setUserVoteQualification: UserVoteQualificationSetter,
  updateIntervalRef: RefObject<NodeJS.Timeout | null>,
) => {
  const { updateInterval, contestDeadline } = curveData;

  if (!updateInterval || !contestDeadline) return;

  // Clear any existing interval
  if (updateIntervalRef.current) {
    clearInterval(updateIntervalRef.current);
  }

  // Set up new interval to check for price updates
  updateIntervalRef.current = setInterval(async () => {
    const { votingTimeLeft, secondsInCycle } = calculateCycleInfo(contestDeadline, updateInterval);

    // If voting has ended, clear the interval
    if (hasVotingEnded(votingTimeLeft)) {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      return;
    }

    // Update user votes at the start of each cycle
    if (shouldUpdateVotes(secondsInCycle, updateInterval)) {
      await calculateUserVoteQualification(
        address,
        userAddress,
        chainId,
        abi,
        "currentPricePerVote",
        setUserVoteQualification,
      );
    }
  }, 1000); // Check every second
};

/**
 * Clean up periodic update intervals
 * @param updateIntervalRef - Ref containing the interval timer
 */
export const cleanupExponentialUpdates = (updateIntervalRef: RefObject<NodeJS.Timeout | null>) => {
  if (updateIntervalRef.current) {
    clearInterval(updateIntervalRef.current);
    updateIntervalRef.current = null;
  }
};
