import ChargeInfo from "@components/ChargeLayout/components/Vote/components/ChargeInfo";
import MyVotes from "@components/ChargeLayout/components/Vote/components/MyVotes";
import TotalCharge from "@components/ChargeLayout/components/Vote/components/TotalCharge";
import { FC } from "react";

interface VoteInfoSectionProps {
  balanceData: any;
  amountOfVotes: number;
  charge: any;
  voteAmount: number;
  onAddFunds?: () => void;
}

const VoteInfoSection: FC<VoteInfoSectionProps> = ({ balanceData, amountOfVotes, charge, voteAmount, onAddFunds }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <MyVotes balanceData={balanceData} amountOfVotes={amountOfVotes} charge={charge} onAddFunds={onAddFunds} />
        {charge ? <ChargeInfo charge={charge} /> : null}
      </div>
      {charge ? <TotalCharge charge={charge} amountOfVotes={voteAmount} /> : null}
    </div>
  );
};

export default VoteInfoSection;
