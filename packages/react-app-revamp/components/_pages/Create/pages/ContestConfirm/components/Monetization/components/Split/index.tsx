import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface SplitMessageProps {
  splitFeeDestinationType: SplitFeeDestinationType;
}

const SplitMessage: FC<SplitMessageProps> = ({ splitFeeDestinationType }) => {
  if (
    splitFeeDestinationType === SplitFeeDestinationType.CreatorWallet ||
    splitFeeDestinationType === SplitFeeDestinationType.AnotherWallet
  ) {
    return <li className="text-[16px] list-disc normal-case">all charges split 70 (you)/30 (jk labs inc.)</li>;
  }

  return <li className="text-[16px] list-disc normal-case">all charges go to jk labs inc.</li>;
};

export default SplitMessage;
