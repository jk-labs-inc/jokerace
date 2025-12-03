import Loader from "@components/UI/Loader";
import RewardsError from "@components/_pages/Contest/Rewards/modules/shared/Error";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCancelRewards } from "@hooks/useCancelRewards";
import { Charge } from "@hooks/useDeployContest/types";
import useRewardsModule from "@hooks/useRewards";
import { FC } from "react";
import { Abi } from "viem";
import RewardsParametersDisplay from "./components/Display";
import { useLocation } from "@tanstack/react-router";

interface ContestParametersRewardsProps {
  version: string;
  charge: Charge;
}

const ContestParametersRewards: FC<ContestParametersRewardsProps> = ({ version, charge }) => {
  const location = useLocation();
  const { chainName } = extractPathSegments(location.pathname);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;

  const { data: rewards, isLoading, isSuccess, isError, refetch } = useRewardsModule();
  const { isCanceled } = useCancelRewards({
    rewardsAddress: rewards?.contractAddress as `0x${string}`,
    abi: rewards?.abi as Abi,
    chainId,
    version,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <RewardsError onRetry={refetch} />;
  }

  if (!rewards) return null;

  if (isCanceled) return null;

  return <RewardsParametersDisplay rewardsStore={rewards} chainId={chainId} charge={charge} />;
};

export default ContestParametersRewards;
