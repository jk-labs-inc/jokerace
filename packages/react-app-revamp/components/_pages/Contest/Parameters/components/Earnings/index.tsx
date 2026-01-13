import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCreatorSplitEnabled from "@hooks/useCreatorSplitEnabled";
import { Charge } from "@hooks/useDeployContest/types";
import useRewardsModule from "@hooks/useRewards";
import { FC } from "react";
import { useShallow } from "zustand/shallow";

interface ContestParametersEarningsProps {
  charge: Charge;
  contestAuthor: string;
  blockExplorerUrl?: string;
}

const ContestParametersEarnings: FC<ContestParametersEarningsProps> = ({ charge, blockExplorerUrl }) => {
  const { address, abi, chainId, version } = useContestConfigStore(
    useShallow(state => ({
      address: state.contestConfig.address,
      abi: state.contestConfig.abi,
      chainId: state.contestConfig.chainId,
      version: state.contestConfig.version,
    })),
  );
  const { creatorSplitEnabled } = useCreatorSplitEnabled({ address, abi, chainId, version });
  const { data: rewardsModule } = useRewardsModule();
  const isRewardsPoolSelfFunded = rewardsModule?.isSelfFunded;
  const isCreatorSplitEnabled = creatorSplitEnabled === 1;

  const renderJkLabsSplitMessage = () => {
    const splitPercentage = charge.percentageToRewards;
    const percentageToJkLabs = 100 - splitPercentage;
    const jkLabsPercentage = isCreatorSplitEnabled ? percentageToJkLabs / 2 : percentageToJkLabs;

    if (isRewardsPoolSelfFunded) {
      return <li className="text-[16px] list-disc normal-case">{jkLabsPercentage}% of charges go to jk labs inc.</li>;
    }

    return <li className="text-[16px] list-disc normal-case">all charges go to jk labs inc.</li>;
  };

  const renderCreatorSplitMessage = () => {
    if (!isCreatorSplitEnabled || !isRewardsPoolSelfFunded) return null;

    const splitPercentage = charge.percentageToRewards;
    const percentageToJkLabs = 100 - splitPercentage;
    const creatorPercentage = percentageToJkLabs / 2;

    return <li className="text-[16px] list-disc normal-case">{creatorPercentage}% of charges go to creator</li>;
  };

  const renderRewardsPoolMessage = () => {
    const splitPercentage = charge.percentageToRewards;

    if (!isRewardsPoolSelfFunded) {
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

    return `${splitPercentage}% of charges go to rewards pool`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <p className="text-[24px] text-neutral-11">charges</p>
      </div>
      <ul className="pl-4 text-[16px] text-neutral-9">
        {isRewardsPoolSelfFunded ? <li className="list-disc">{renderRewardsPoolMessage()}</li> : null}
        {renderCreatorSplitMessage()}
        {renderJkLabsSplitMessage()}
      </ul>
    </div>
  );
};

export default ContestParametersEarnings;
