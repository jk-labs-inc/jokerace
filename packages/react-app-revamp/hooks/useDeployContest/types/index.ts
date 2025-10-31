export const MAX_SUBMISSIONS_PER_CONTEST = 1000;
export const MAX_ALLOWED_SUBMISSIONS_PER_USER = 1000;
export const DEFAULT_ALLOWED_SUBMISSIONS_PER_USER = 8;

export type Recipient = {
  address: string;
  numVotes: string;
};

export enum VoteType {
  PerVote = "PerVote",
  PerTransaction = "PerTransaction",
}

export type Charge = {
  percentageToCreator: number;
  voteType: VoteType;
  type: {
    costToPropose: number;
    costToVote: number;
    costToVoteStartPrice?: number;
    costToVoteEndPrice?: number;
  };
  error?: boolean;
};

export enum PriceCurveType {
  Flat = "Flat",
  Exponential = "Exponential",
}

export interface PriceCurve {
  type: PriceCurveType;
  multiple: number;
}

export interface ContestValues {
  anyoneCanSubmit: number;
  datetimeOpeningSubmissions: Date;
  datetimeOpeningVoting: Date;
  datetimeClosingVoting: Date;
  title: string;
  type: string;
  prompt: string;
  contractAddress: string;
  networkName: string;
  voting_requirements: any;
  cost_to_propose: number;
  cost_to_vote: number;
  percentage_to_creator: number;
  authorAddress?: string;
  featured?: boolean;
}

export type DeploymentPhase =
  | "idle"
  | "deploying-contest"
  | "deploying-rewards"
  | "attaching-rewards"
  | "funding-pool"
  | "completed"
  | "failed";

export type TransactionStatus = "pending" | "loading" | "success" | "error";

export interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  error?: string;
}

export interface DeploymentProcessState {
  phase: DeploymentPhase;
  transactions: {
    deployContest: TransactionState;
    deployRewards: TransactionState;
    attachRewards: TransactionState;
    fundTokens: Record<string, TransactionState>;
  };
  contestAddress?: string;
  rewardsModuleAddress?: string;
  chainId?: number;
}

export const createInitialDeploymentProcessState = (): DeploymentProcessState => ({
  phase: "idle",
  transactions: {
    deployContest: { status: "pending" },
    deployRewards: { status: "pending" },
    attachRewards: { status: "pending" },
    fundTokens: {},
  },
});

export const isCriticalPhaseComplete = (phase: DeploymentPhase): boolean => {
  return phase === "completed" || phase === "funding-pool" || phase === "attaching-rewards";
};

export const canNavigateToContest = (state: DeploymentProcessState): boolean => {
  const contestDeployed = state.transactions.deployContest.status === "success";
  const rewardsDeployed = state.transactions.deployRewards.status === "success";
  const rewardsAttached = state.transactions.attachRewards.status === "success";
  const rewardsDeployFailed = state.transactions.deployRewards.status === "error";
  const rewardsAttachFailed = state.transactions.attachRewards.status === "error";

  // Navigate if all 3 succeed OR if contest succeeds but rewards phases fail
  return (
    (contestDeployed && rewardsDeployed && rewardsAttached) ||
    (contestDeployed && (rewardsDeployFailed || rewardsAttachFailed))
  );
};
