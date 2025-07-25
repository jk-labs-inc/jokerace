import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { JK_LABS_SPLIT_DESTINATION_DEFAULT } from "@hooks/useDeployContest";
import { Charge, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import ContestParamsEarningsModal from "./components/Modal";

interface ContestParametersEarningsProps {
  charge: Charge;
  contestAuthor: string;
  blockExplorerUrl?: string;
}

const ContestParametersEarnings: FC<ContestParametersEarningsProps> = ({ charge, blockExplorerUrl, contestAuthor }) => {
  const { address } = useAccount();
  const isConnectedWalletAuthor = address === contestAuthor;
  const isCreatorSplit = charge.splitFeeDestination.type !== SplitFeeDestinationType.NoSplit;
  const creatorSplitDestination = charge.splitFeeDestination.address
    ? charge.splitFeeDestination.address
    : contestAuthor;
  const blockExplorerAddressUrl = blockExplorerUrl
    ? `${blockExplorerUrl}/address/${
        charge.splitFeeDestination.type === SplitFeeDestinationType.NoSplit
          ? JK_LABS_SPLIT_DESTINATION_DEFAULT
          : creatorSplitDestination
      }`
    : "";
  const [isEditEarningsModalOpen, setIsEditEarningsModalOpen] = useState(false);
  const { contestState } = useContestStateStore(state => state);
  const isContestFinishedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;

  const renderEarningsSplitMessage = () => {
    const splitPercentage = charge.percentageToCreator;
    const percentageToJkLabs = 100 - splitPercentage;

    if (isCreatorSplit) {
      return <li className="text-[16px] list-disc normal-case">{percentageToJkLabs}% of charges go to jk labs inc.</li>;
    } else {
      return <li className="text-[16px] list-disc normal-case">all charges go to jk labs inc.</li>;
    }
  };

  const creatorEarningsDestinationMessage = () => {
    const splitPercentage = charge.percentageToCreator;

    if (charge.splitFeeDestination.type === SplitFeeDestinationType.RewardsPool) {
      return `${splitPercentage}% of charges go to rewards pool`;
    } else {
      return (
        <>
          {splitPercentage}% of charges go to the creator{" "}
          <a className="underline cursor-pointer text-positive-11" target="_blank" href={blockExplorerAddressUrl}>
            ({shortenEthereumAddress(creatorSplitDestination)})
          </a>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <p className="text-[24px] text-neutral-11">charges</p>
        {isConnectedWalletAuthor && charge.percentageToCreator > 0 && !isContestFinishedOrCanceled && (
          <button onClick={() => setIsEditEarningsModalOpen(true)}>
            <PencilSquareIcon className="w-6 h-6 text-neutral-11 hover:text-neutral-11 transition-colors duration-300 ease-in-out" />
          </button>
        )}
      </div>
      <ul className="pl-4 text-[16px] text-neutral-9">
        {isCreatorSplit ? <li className="list-disc">{creatorEarningsDestinationMessage()}</li> : null}
        {renderEarningsSplitMessage()}
      </ul>

      <ContestParamsEarningsModal
        charge={charge}
        isOpen={isEditEarningsModalOpen}
        onClose={() => setIsEditEarningsModalOpen(false)}
      />
    </div>
  );
};

export default ContestParametersEarnings;
