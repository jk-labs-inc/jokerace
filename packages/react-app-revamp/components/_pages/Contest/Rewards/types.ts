export interface Reward {
  value: bigint;
  currency: string;
  decimals: number;
}

export interface Distribution {
  rank: number;
  rewards: Reward[];
}
