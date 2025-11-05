import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { Charge } from "@hooks/useDeployContest/types";
import useRewardsModule from "@hooks/useRewards";
import { FC } from "react";

interface ContestParametersEarningsProps {
  charge: Charge;
  contestAuthor: string;
  blockExplorerUrl?: string;
}

const ContestParametersEarnings: FC<ContestParametersEarningsProps> = ({ charge, blockExplorerUrl }) => {
  const { data: rewardsModule } = useRewardsModule();
  const isRewardsPoolSelfFunded = rewardsModule?.isSelfFunded;

  const renderEarningsSplitMessage = () => {
    const splitPercentage = charge.percentageToCreator;
    const percentageToJkLabs = 100 - splitPercentage;

    if (isRewardsPoolSelfFunded) {
      return <li className="text-[16px] list-disc normal-case">{percentageToJkLabs}% of charges go to jk labs inc.</li>;
    } else {
      return <li className="text-[16px] list-disc normal-case">all charges go to jk labs inc.</li>;
    }
  };

  const creatorEarningsDestinationMessage = () => {
    const splitPercentage = charge.percentageToCreator;

    if (isRewardsPoolSelfFunded) {
      return `${splitPercentage}% of charges go to rewards pool`;
    } else {
      return (
        <>
          {splitPercentage}% of charges go to the creator{" "}
          <a
            className="underline cursor-pointer text-positive-11"
            target="_blank"
            href={blockExplorerUrl ? `${blockExplorerUrl}/address/${rewardsModule?.contractAddress}` : ""}
          >
            ({shortenEthereumAddress(rewardsModule?.contractAddress as string)})
          </a>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <p className="text-[24px] text-neutral-11">charges</p>
      </div>
      <ul className="pl-4 text-[16px] text-neutral-9">
        {isRewardsPoolSelfFunded ? <li className="list-disc">{creatorEarningsDestinationMessage()}</li> : null}
        {renderEarningsSplitMessage()}
      </ul>
    </div>
  );
};

export default ContestParametersEarnings;
