import { CycleInfo } from "../types";

/**
 * Calculate time-based cycle information for exponential curves
 * @param contestDeadline - Contest deadline timestamp
 * @param updateInterval - Price update interval in seconds
 * @returns Object with voting time left and seconds in current cycle
 */
export const calculateCycleInfo = (contestDeadline: number, updateInterval: number): CycleInfo => {
  const now = Math.floor(Date.now() / 1000);
  const votingTimeLeft = Math.max(0, contestDeadline - now);
  const secondsInCycle = votingTimeLeft % updateInterval;

  return { votingTimeLeft, secondsInCycle };
};

/**
 * Check if we should update user votes based on cycle timing
 * @param secondsInCycle - Current seconds within the update cycle
 * @param updateInterval - Total update interval in seconds
 * @returns Whether an update should be triggered
 */
export const shouldUpdateVotes = (secondsInCycle: number, updateInterval: number): boolean => {
  return secondsInCycle >= updateInterval - 1;
};

/**
 * Check if voting has ended
 * @param votingTimeLeft - Remaining voting time in seconds
 * @returns Whether voting has ended
 */
export const hasVotingEnded = (votingTimeLeft: number): boolean => {
  return votingTimeLeft <= 0;
};
