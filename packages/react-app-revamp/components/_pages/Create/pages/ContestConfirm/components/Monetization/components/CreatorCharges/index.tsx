import { FC } from "react";

interface CreatorChargesMessageProps {
  percentageToRewards: number;
  creatorSplitEnabled: number;
}

const CreatorChargesMessage: FC<CreatorChargesMessageProps> = ({ percentageToRewards, creatorSplitEnabled }) => {
  const isCreatorSplitEnabled = creatorSplitEnabled === 1;
  const percentageToJkLabs = 100 - percentageToRewards;
  const jkLabsPercentage = isCreatorSplitEnabled ? percentageToJkLabs / 2 : percentageToJkLabs;
  const creatorPercentage = percentageToJkLabs / 2;

  return (
    <>
      <li className="text-[16px]">{percentageToRewards}% of charges go to rewards pool</li>
      {isCreatorSplitEnabled ? (
        <>
          <li className="text-[16px]">{creatorPercentage}% of charges go to creator</li>
          <li className="text-[16px]">{jkLabsPercentage}% of charges go to jk labs inc.</li>
        </>
      ) : (
        <li className="text-[16px]">{jkLabsPercentage}% of charges go to jk labs inc.</li>
      )}
    </>
  );
};

export default CreatorChargesMessage;
