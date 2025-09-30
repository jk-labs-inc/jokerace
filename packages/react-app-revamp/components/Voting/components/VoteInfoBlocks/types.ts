export type VoteInfoBlockType = "my-votes" | "charge-info" | "total-charge";

interface BaseVoteInfoBlocksProps {
  type: VoteInfoBlockType;
}

export interface MyVotesProps extends BaseVoteInfoBlocksProps {
  type: "my-votes";
  userAddress: string;
  amountOfVotes: number;
  onAddFunds?: () => void;
}

export interface ChargeInfoProps extends BaseVoteInfoBlocksProps {
  type: "charge-info";
}

export interface TotalChargeProps extends BaseVoteInfoBlocksProps {
  type: "total-charge";
  amountOfVotes: number;
}

export type VoteInfoBlocksProps = MyVotesProps | ChargeInfoProps | TotalChargeProps;
