import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCancelRewards } from "@hooks/useCancelRewards";
import useRewardsModule from "@hooks/useRewards";
import { usePathname } from "next/navigation";
import { FC } from "react";
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

  const { data: rewards, isLoading, isSuccess, isError } = useRewardsModule();
  //TODO: use enabled here to wait for abi?
  const { isCanceled } = useCancelRewards({
    rewardsAddress: rewards?.contractAddress as `0x${string}`,
    abi: rewards?.abi as Abi,
    chainId,
    version,
  });

  if (isLoading) {
    return <RewardsLoader />;
  }

  if (isError || !isSuccess || isCanceled) return null;

  if (!rewards) return null;

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
