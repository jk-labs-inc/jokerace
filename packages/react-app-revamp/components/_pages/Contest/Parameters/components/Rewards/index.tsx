import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCancelRewards } from "@hooks/useCancelRewards";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";
import { Abi } from "viem";
import RewardsParametersDisplay from "./components/Display";
import { Charge } from "@hooks/useDeployContest/types";
import Loader from "@components/UI/Loader";
import RewardsError from "@components/_pages/Contest/Rewards/modules/shared/Error";

interface ContestParametersRewardsProps {
  version: string;
  charge: Charge;
}

const ContestParametersRewards: FC<ContestParametersRewardsProps> = ({ version, charge }) => {
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
    return <Loader />;
  }

  if (isError) {
    return <RewardsError onRetry={getContestRewardsModule} />;
  }

  if (isCanceled) return null;

  return <RewardsParametersDisplay rewardsStore={rewards} chainId={chainId} charge={charge} />;
};

export default ContestParametersRewards;
