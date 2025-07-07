// Re-export from the modular implementation
export { useAnyoneCanVote } from "./useAnyoneCanVote/index";

// Re-export types for backwards compatibility
export type {
  ExponentialCurveData,
  UserVoteQualificationSetter,
  UseAnyoneCanVoteReturn,
} from "./useAnyoneCanVote/types";
