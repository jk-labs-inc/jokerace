import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { FC } from "react";

interface CreatorChargesMessageProps {
  percentageToCreator: number;
}

const CreatorChargesMessage: FC<CreatorChargesMessageProps> = ({ percentageToCreator }) => {
  return <li className="text-[16px]">{percentageToCreator}% of all charges go to rewards pool</li>;
};

export default CreatorChargesMessage;
