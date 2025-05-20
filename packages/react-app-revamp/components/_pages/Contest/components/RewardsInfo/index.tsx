import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCancelRewards } from "@hooks/useCancelRewards";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";
import { Abi } from "viem";
import RewardsDisplay from "./components/RewardsDisplay";
import RewardsLoader from "./components/RewardsLoader";

interface ContestRewardsInfoProps {
  version: string;
}

const ContestRewardsInfo: FC<ContestRewardsInfoProps> = ({ version }) => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;

  const { getContestRewardsModule } = useRewardsModule();
  const { rewards, isLoading, isSuccess, isError } = useRewardsStore(state => state);
  const { isCanceled } = useCancelRewards({
    rewardsAddress: rewards.contractAddress as `0x${string}`,
    abi: rewards.abi as Abi,
    chainId,
    version,
  });

  useEffect(() => {
    if (!isSuccess && !isLoading && !isError) {
      getContestRewardsModule();
    }
  }, [isSuccess, isLoading, isError, getContestRewardsModule]);

  if (isLoading) {
    return <RewardsLoader />;
  }

  if (isError || !isSuccess || isCanceled) return null;

  return (
    <RewardsDisplay
      rewardsModuleAddress={rewards.contractAddress as `0x${string}`}
      rewardsAbi={rewards.abi as Abi}
      chainId={chainId}
      payees={rewards.payees}
    />
  );
};

export default ContestRewardsInfo;
