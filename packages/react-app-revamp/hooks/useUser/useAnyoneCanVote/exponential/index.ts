import { RefObject } from "react";
import { Abi } from "viem";
import { calculateUserVoteQualification } from "../qualification";
import { ExponentialCurveData, UserVoteQualificationSetter } from "../types";
import { calculateCycleInfo, hasVotingEnded, shouldUpdateVotes } from "../utils";

const focusListeners = new Set<() => void>();

/**
 * Set up smart periodic updates for exponential price curves
 * Handles both "waiting for voting to start" and "voting in progress" states
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
  const { updateInterval, contestDeadline, voteStart } = curveData;

  if (!updateInterval || !contestDeadline || !voteStart) return;

  // Clear any existing interval
  if (updateIntervalRef.current) {
    clearInterval(updateIntervalRef.current);
  }

  // Function to calculate votes if voting is active
  const calculateVotesIfActive = async () => {
    const now = Math.floor(Date.now() / 1000);
    const votingStarted = voteStart <= now;

    if (!votingStarted) return;

    const { votingTimeLeft } = calculateCycleInfo(contestDeadline, updateInterval);
    if (hasVotingEnded(votingTimeLeft)) return;

    await calculateUserVoteQualification(
      address,
      userAddress,
      chainId,
      abi,
      "currentPricePerVote",
      setUserVoteQualification,
    );
  };

  // Add window focus event listener (same pattern as TanStack Query)
  const handleWindowFocus = () => {
    calculateVotesIfActive();
  };

  window.addEventListener("focus", handleWindowFocus);
  focusListeners.add(handleWindowFocus);

  // Check if voting has already started
  const currentTime = Math.floor(Date.now() / 1000);
  const hasVotingStarted = voteStart <= currentTime;

  // If voting has already started, do immediate calculation
  if (hasVotingStarted) {
    calculateUserVoteQualification(address, userAddress, chainId, abi, "currentPricePerVote", setUserVoteQualification);
  }

  // Set up interval for future updates
  updateIntervalRef.current = setInterval(async () => {
    const now = Math.floor(Date.now() / 1000);
    const votingStarted = voteStart <= now;

    // If voting hasn't started yet, just wait
    if (!votingStarted) {
      return;
    }

    // If voting just started this cycle, do immediate calculation
    const timeSinceVotingStart = now - voteStart;
    if (timeSinceVotingStart >= 0 && timeSinceVotingStart < 1) {
      await calculateUserVoteQualification(
        address,
        userAddress,
        chainId,
        abi,
        "currentPricePerVote",
        setUserVoteQualification,
      );
      return;
    }

    // Check if voting has ended
    const { votingTimeLeft, secondsInCycle } = calculateCycleInfo(contestDeadline, updateInterval);

    if (hasVotingEnded(votingTimeLeft)) {
      // Voting has ended, clean up
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      // Clean up focus event listener
      window.removeEventListener("focus", handleWindowFocus);
      focusListeners.delete(handleWindowFocus);
      return;
    }

    // Update user votes at the start of each cycle with 2-second buffer
    if (shouldUpdateVotes(secondsInCycle, updateInterval)) {
      // Add 2-second buffer to ensure smart contract has updated
      setTimeout(async () => {
        await calculateUserVoteQualification(
          address,
          userAddress,
          chainId,
          abi,
          "currentPricePerVote",
          setUserVoteQualification,
        );
      }, 2000);
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

  // Clean up all focus event listeners
  focusListeners.forEach(listener => {
    window.removeEventListener("focus", listener);
  });
  focusListeners.clear();
};
