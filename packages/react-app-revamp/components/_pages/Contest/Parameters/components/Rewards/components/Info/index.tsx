import { Charge } from "@hooks/useDeployContest/types";
import { FC } from "react";
import { RewardModuleInfo } from "lib/rewards/types";
import RewardsParametersTokens from "../Tokens";

interface RewardsParametersInfoProps {
  rewardsStore: RewardModuleInfo;
  charge: Charge;
  chainId: number;
}

const RewardsParametersInfo: FC<RewardsParametersInfoProps> = ({ rewardsStore, charge, chainId }) => {
  const isRewardsPoolSelfFunded = charge.splitFeeDestination.address === rewardsStore.contractAddress;

  return (
    <ul className="pl-4 text-[16px] text-neutral-9">
      {isRewardsPoolSelfFunded ? (
        <li className="list-disc">
          <b>rewards go up as players enter and vote,</b> with {charge.percentageToCreator}% of <br />
          their charges going into pool
        </li>
      ) : null}
      <RewardsParametersTokens rewardsStore={rewardsStore} chainId={chainId} />
      <li className="list-disc">contest creator can withdraw funds</li>
      <li className="list-disc">in case of ties, funds revert to creator</li>
      <li className="list-disc">
        see rewards pool address{" "}
        <a
          className="text-positive-11 cursor-pointer"
          href={`${rewardsStore.blockExplorers}address/${rewardsStore.contractAddress}`}
          target="_blank"
        >
          here
        </a>
      </li>
    </ul>
  );
};

export default RewardsParametersInfo;
