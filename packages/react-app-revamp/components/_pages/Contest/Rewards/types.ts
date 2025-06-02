export interface Reward {
  value: bigint;
  address: string;
  symbol: string;
  decimals: number;
}

export interface Distribution {
  rank: number;
  rewards: Reward[];
}
