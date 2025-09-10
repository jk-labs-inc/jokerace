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
import NoRewardsInfo from "./components/NoRewards";
import RewardsError from "./modules/shared/Error";
import RewardsCanceled from "./modules/shared/RewardsCanceled";
import VotersRewardsPage from "./modules/Voters";
import CreateRewards from "./components/Create";
import { getChainExplorer } from "@helpers/getChainExplorer";

const ContestRewards = () => {
  const asPath = usePathname();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const chainExplorer = getChainExplorer(chainId);
  const { contestAuthorEthereumAddress, version } = useContestStore(state => state);
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
    return <CreateRewards />;
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
        version={version}
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
        <div className="flex flex-col gap-2">
          <p className="text-[18px] text-neutral-11">winners rewards are not supported anymore</p>
          <p className="text-[16px] text-neutral-11">
            if you would still like to look at contract, you can see it{" "}
            <a
              href={`${chainExplorer}address/${rewards.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-positive-11 font-bold"
            >
              here
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ContestRewards;
