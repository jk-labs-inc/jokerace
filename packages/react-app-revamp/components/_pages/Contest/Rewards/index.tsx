import Loader from "@components/UI/Loader";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCancelRewards } from "@hooks/useCancelRewards";
import { useContestStore } from "@hooks/useContest/store";
import useRewardsModule from "@hooks/useRewards";
import { ModuleType } from "lib/rewards/types";
import { usePathname } from "next/navigation";
import { Abi } from "viem";
import { useAccount, useAccountEffect } from "wagmi";
import CreateRewardsModule from "./components/CreateRewardsModule";
import NoRewardsInfo from "./components/NoRewards";
import RewardsError from "./modules/shared/Error";
import RewardsCanceled from "./modules/shared/RewardsCanceled";
import VotersRewardsPage from "./modules/Voters";
import WinnersRewardsPage from "./modules/Winners";

const ContestRewards = () => {
  const asPath = usePathname();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;

  const {
    contestAuthorEthereumAddress,
    sortingEnabled,
    contestMaxProposalCount,
    contestAbi,
    version,
    downvotingAllowed,
  } = useContestStore(state => state);
  const { data: rewards, isLoading, isError, refetch, isRefetching } = useRewardsModule();
  const { address: accountAddress } = useAccount();
  const creator = contestAuthorEthereumAddress === accountAddress;
  const {
    isCanceled,
    isError: isRewardsCanceledError,
    refetch: refetchRewardsCanceled,
  } = useCancelRewards({
    rewardsAddress: rewards?.contractAddress as `0x${string}`,
    abi: rewards?.abi as Abi,
    chainId,
    version,
  });

  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  if (isLoading || isRefetching) return <Loader>Loading rewards</Loader>;

  if (isRewardsCanceledError || isError) {
    return <RewardsError onRetry={isRewardsCanceledError ? refetchRewardsCanceled : refetch} />;
  }

  if (!rewards && !creator) {
    return <NoRewardsInfo />;
  }

  if (!rewards && creator) {
    return (
      <CreateRewardsModule
        contestMaxProposalCount={contestMaxProposalCount}
        downvotingAllowed={downvotingAllowed}
        sortingEnabled={sortingEnabled}
        version={version}
      />
    );
  }

  if (!rewards) return null;

  if (isCanceled) {
    return (
      <RewardsCanceled
        isCreatorView={creator}
        rewardsModuleAddress={rewards.contractAddress as `0x${string}`}
        rewardsAbi={rewards.abi as Abi}
        rankings={rewards.payees}
        chainId={chainId}
      />
    );
  }

  return (
    <div className="animate-reveal">
      {rewards.moduleType === ModuleType.VOTER_REWARDS ? (
        <VotersRewardsPage
          rewards={rewards}
          contestAddress={contestAddress as `0x${string}`}
          chainId={chainId}
          version={version}
        />
      ) : rewards.moduleType === ModuleType.AUTHOR_REWARDS ? (
        <WinnersRewardsPage
          rewards={rewards}
          contestAddress={contestAddress as `0x${string}`}
          chainId={chainId}
          contestAbi={contestAbi}
          version={version}
        />
      ) : null}
    </div>
  );
};

export default ContestRewards;
