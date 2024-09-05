import { formatBalance } from "@helpers/formatBalance";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { useDistributeRewardStore } from "@hooks/useDistributeRewards";
import useFundRewardsModule from "@hooks/useFundRewards";
import { TokenInfo } from "@hooks/useReleasableRewards";
import { ProcessedReleasedRewards } from "@hooks/useReleasedRewards";
import { useWithdrawRewardStore } from "@hooks/useWithdrawRewards";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

interface RewardsPreviouslyDistributedTableProps {
  payee: number;
  releasedRewards: ProcessedReleasedRewards[];
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  chainId: number;
}

const RewardsPreviouslyDistributedTable: FC<RewardsPreviouslyDistributedTableProps> = ({ ...props }) => {
  const { payee, releasedRewards, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;
  const { isLoading: isDistributeRewardsLoading } = useDistributeRewardStore(state => state);
  const {
    data: share,
    isError,
    isLoading: isSharesLoading,
  } = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId: chainId,
    functionName: "shares",
    args: [Number(payee)],
    query: {
      select(data) {
        return Number(data);
      },
    },
  });
  const payeeRewardInfo = releasedRewards.find(reward => reward.ranking === payee);

  const isLoading = isSharesLoading || isDistributeRewardsLoading;

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      {isError && "Something went wrong, please reload the page."}

      {share && (
        <div className="flex flex-col gap-8 max-w-[500px]">
          <div className="flex flex-col gap-3">
            <p className="text-[16px] font-bold text-neutral-9">
              {payee}
              <sup>{returnOnlySuffix(payee)}</sup> <span className="ml-1">place</span>
            </p>
            <ul className="flex flex-col gap-3 pl-4 text-[16px] font-bold list-gray-dot">
              {payeeRewardInfo ? (
                payeeRewardInfo.tokens.map((token: TokenInfo, tokenIndex: number) => (
                  <li key={`${payeeRewardInfo.ranking}-${tokenIndex}`} className="flex items-center">
                    {isLoading || isDistributeRewardsLoading ? (
                      <Skeleton width={200} height={16} />
                    ) : (
                      <p className="text-neutral-9">
                        {formatBalance(formatUnits(token.amount ?? 0n, token.decimals ?? 18))}{" "}
                        <span className="uppercase">${token.symbol}</span>
                      </p>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-neutral-9 font-bold">No funds distributed</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
};

export default RewardsPreviouslyDistributedTable;
