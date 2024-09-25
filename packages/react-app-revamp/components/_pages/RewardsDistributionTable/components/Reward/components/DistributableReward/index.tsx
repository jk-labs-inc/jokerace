import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useDistributeRewardStore } from "@hooks/useDistributeRewards";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

interface DistributableRewardProps {
  token: TokenInfo;
  handleDistributeRewards?: () => Promise<void>;
}

export const DistributableReward = (props: DistributableRewardProps) => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const { chainId: userChainId } = useAccount();
  const isConnectedOnCorrectChain = chainId === userChainId;
  const { contestStatus } = useContestStatusStore(state => state);
  const { isLoading: isDistributeRewardsLoading } = useDistributeRewardStore(state => state);
  const { handleDistributeRewards, token } = props;

  const onDistributeRewards = async () => {
    if (!isConnectedOnCorrectChain) {
      switchChain(config, { chainId });
    }

    handleDistributeRewards?.();
  };

  return (
    <div className="flex items-center justify-between w-full">
      <p>
        {formatBalance(formatUnits(token.amount ?? 0n, token.decimals ?? 18).toString())}{" "}
        <span className="uppercase">${token.symbol}</span>
      </p>

      <div data-tooltip-id={`tooltip-${token.symbol}`}>
        <ButtonV3
          isDisabled={contestStatus !== ContestStatus.VotingClosed || isDistributeRewardsLoading}
          size={ButtonSize.EXTRA_SMALL}
          colorClass="bg-gradient-purple"
          onClick={onDistributeRewards}
        >
          distribute
        </ButtonV3>
      </div>
      {contestStatus !== ContestStatus.VotingClosed && (
        <Tooltip id={`tooltip-${token.symbol}`}>
          <span className="text-[16px]">funds cannot be distributed until voting has ended!</span>
        </Tooltip>
      )}
    </div>
  );
};
