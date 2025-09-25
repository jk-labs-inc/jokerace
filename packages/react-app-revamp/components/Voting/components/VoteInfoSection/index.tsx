import ChargeInfo from "@components/ChargeLayout/components/Vote/components/ChargeInfo";
import MyVotes from "@components/ChargeLayout/components/Vote/components/MyVotes";
import TotalCharge from "@components/ChargeLayout/components/Vote/components/TotalCharge";
import { FC } from "react";

interface VoteInfoSectionProps {
  balanceData: any;
  amountOfVotes: number;
  costToVote: number;
  voteAmount: number;
  onAddFunds?: () => void;
}

const VoteInfoSection: FC<VoteInfoSectionProps> = ({
  balanceData,
  amountOfVotes,
  costToVote,
  voteAmount,
  onAddFunds,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <MyVotes
          balanceData={balanceData}
          amountOfVotes={amountOfVotes}
          costToVote={costToVote}
          onAddFunds={onAddFunds}
        />

        {/* TODO: see how we wanna resolve stuff in this component */}
        <ChargeInfo />
      </div>
      <TotalCharge costToVote={costToVote} amountOfVotes={voteAmount} />
    </div>
  );
};

export default VoteInfoSection;
