import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { PERCENTAGE_TO_CREATOR_DEFAULT } from "constants/monetization";
import { FC } from "react";

interface SplitMessageProps {
  splitFeeDestinationType: SplitFeeDestinationType;
}

const SplitMessage: FC<SplitMessageProps> = ({ splitFeeDestinationType }) => {
  if (
    splitFeeDestinationType === SplitFeeDestinationType.CreatorWallet ||
    splitFeeDestinationType === SplitFeeDestinationType.AnotherWallet
  ) {
    return (
      <li className="text-[16px] list-disc normal-case">
        all charges split {PERCENTAGE_TO_CREATOR_DEFAULT} (you)/10 (jk labs inc.)
      </li>
    );
  }

  return <li className="text-[16px] list-disc normal-case">all charges go to jk labs inc.</li>;
};

export default SplitMessage;
