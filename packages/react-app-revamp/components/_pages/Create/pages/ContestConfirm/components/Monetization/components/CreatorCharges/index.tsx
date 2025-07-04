import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface CreatorChargesMessageProps {
  splitFeeDestinationType: SplitFeeDestinationType;
  splitFeeDestinationAddress?: string;
  creatorAddress?: string;
  blockExplorerAddressUrl: string;
}

const CreatorChargesMessage: FC<CreatorChargesMessageProps> = ({
  splitFeeDestinationType,
  splitFeeDestinationAddress,
  creatorAddress,
  blockExplorerAddressUrl,
}) => {
  if (
    splitFeeDestinationType !== SplitFeeDestinationType.AnotherWallet &&
    splitFeeDestinationType !== SplitFeeDestinationType.CreatorWallet
  ) {
    return null;
  }

  const displayAddress =
    splitFeeDestinationType === SplitFeeDestinationType.CreatorWallet
      ? creatorAddress ?? ""
      : splitFeeDestinationAddress ?? "";

  return (
    <li className="text-[16px]">
      creator charges go to{" "}
      <a className="underline cursor-pointer" target="_blank" href={blockExplorerAddressUrl}>
        {shortenEthereumAddress(displayAddress)}
      </a>
    </li>
  );
};

export default CreatorChargesMessage;
