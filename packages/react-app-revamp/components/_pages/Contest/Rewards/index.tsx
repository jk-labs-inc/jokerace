import Loader from "@components/UI/Loader";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useCancelRewards } from "@hooks/useCancelRewards";
import { useContestStore } from "@hooks/useContest/store";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { ModuleType } from "lib/rewards/types";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Abi } from "viem";
import { useAccount, useAccountEffect } from "wagmi";
import CreateRewardsModule from "./components/CreateRewardsModule";
import NoRewardsInfo from "./components/NoRewards";
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
    isSuccess,
    isLoading,
    supportsRewardsModule,
    contestAuthorEthereumAddress,
    sortingEnabled,
    contestMaxProposalCount,
    contestAbi,
    version,
    downvotingAllowed,
  } = useContestStore(state => state);
  const rewardsStore = useRewardsStore(state => state);
  const { getContestRewardsModule } = useRewardsModule();
  const { address: accountAddress } = useAccount();
  const creator = contestAuthorEthereumAddress === accountAddress;
  const {
    isCanceled,
    isLoading: isRewardsCanceledLoading,
    isError: isRewardsCanceledError,
  } = useCancelRewards({
    rewardsAddress: rewardsStore.rewards.contractAddress as `0x${string}`,
    abi: rewardsStore.rewards.abi as Abi,
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

  useEffect(() => {
    if (rewardsStore.isSuccess) return;
    if (supportsRewardsModule) getContestRewardsModule();
  }, [supportsRewardsModule, rewardsStore.isSuccess]);

  if (!supportsRewardsModule && !creator) {
    return <NoRewardsInfo />;
  }

  if (!supportsRewardsModule && creator) {
    return (
      <CreateRewardsModule
        contestMaxProposalCount={contestMaxProposalCount}
        downvotingAllowed={downvotingAllowed}
        sortingEnabled={sortingEnabled}
        version={version}
      />
    );
  }

  //TODO: add unified error handling for all errors
  if (isRewardsCanceledError) {
    return <div>Error loading rewards</div>;
  }

  if (isCanceled) {
    return (
      <RewardsCanceled
        isCreatorView={creator}
        rewardsModuleAddress={rewardsStore.rewards.contractAddress as `0x${string}`}
        rewardsAbi={rewardsStore.rewards.abi as Abi}
        rankings={rewardsStore.rewards.payees}
        chainId={chainId}
      />
    );
  }

  return (
    <div className="animate-reveal">
      {!isLoading && isSuccess && (
        <>
          {rewardsStore.isLoading || (isRewardsCanceledLoading && <Loader>Loading rewards</Loader>)}
          {rewardsStore.isSuccess &&
            (rewardsStore.rewards.moduleType === ModuleType.VOTER_REWARDS ? (
              <VotersRewardsPage
                rewardsModuleAbi={rewardsStore.rewards.abi as Abi}
                contestAddress={contestAddress as `0x${string}`}
                chainId={chainId}
                contestRewardsModuleAddress={rewardsStore.rewards.contractAddress as `0x${string}`}
                version={version}
              />
            ) : rewardsStore.rewards.moduleType === ModuleType.AUTHOR_REWARDS ? (
              <WinnersRewardsPage
                contestAddress={contestAddress as `0x${string}`}
                chainId={chainId}
                contestRewardsModuleAddress={rewardsStore.rewards.contractAddress as `0x${string}`}
                contestAbi={contestAbi as Abi}
                rewardsModuleAbi={rewardsStore.rewards.abi as Abi}
                version={version}
              />
            ) : null)}
        </>
      )}
    </div>
  );
};

export default ContestRewards;
