import { Abi } from "viem";
import { PriceCurveType } from "@hooks/useDeployContest/types";

/**
 * Configuration data for exponential price curves
 */
export interface ExponentialCurveData {
  updateInterval: number;
  contestDeadline: number;
  voteStart: number;
  isLoaded: boolean;
}

/**
 * Parameters for user vote qualification calculation
 */
export interface VoteQualificationParams {
  abi: Abi;
  voteCostFunctionName: "costToVote" | "currentPricePerVote";
  setUserVoteQualification: UserVoteQualificationSetter;
}

/**
 * Function signature for setting user vote qualification state
 */
export type UserVoteQualificationSetter = (
  totalVotes: number,
  availableVotes: number,
  success: boolean,
  loading: boolean,
  error: boolean,
) => void;

/**
 * Parameters for the main qualification check function
 */
export interface QualificationCheckParams {
  abi: any;
  version: string;
  setUserVoteQualification: UserVoteQualificationSetter;
}

/**
 * Time-based cycle information for price curve calculations
 */
export interface CycleInfo {
  votingTimeLeft: number;
  secondsInCycle: number;
}

