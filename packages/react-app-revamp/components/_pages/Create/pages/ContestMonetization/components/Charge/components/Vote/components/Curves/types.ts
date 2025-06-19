export interface PriceCurveContentProps {
  costToVote: number;
  label: string;
  errorMessage?: string;
  onCostToVoteChange?: (value: number) => void;
}

export interface ExponentialPriceCurveContentProps extends PriceCurveContentProps {
  costToVoteEndPrice?: number;
  onCostToVoteEndPriceChange?: (value: number) => void;
  onMultipleChange: (value: number) => void;
}

export interface CreateContestChargeVoteCurvesProps {
  costToVote: number;
  label: string;
  errorMessage?: string;
  costToVoteEndPrice?: number;
  onCostToVoteChange?: (value: number) => void;
  onCostToVoteEndPriceChange?: (value: number) => void;
} 