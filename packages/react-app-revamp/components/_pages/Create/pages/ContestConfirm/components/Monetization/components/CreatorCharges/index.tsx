import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { FC } from "react";

interface CreatorChargesMessageProps {
  percentageToRewards: number;
}

const CreatorChargesMessage: FC<CreatorChargesMessageProps> = ({ percentageToRewards }) => {
  return <li className="text-[16px]">{percentageToRewards}% of all charges go to rewards pool</li>;
};

export default CreatorChargesMessage;
