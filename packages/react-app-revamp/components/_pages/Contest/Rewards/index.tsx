import Loader from "@components/UI/Loader";
import DialogAddFundsToRewardsModule from "@components/_pages/DialogAddFundsToRewardsModule";
import { FOOTER_LINKS } from "@config/links";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { REWARDS_CANCELED_VERSION, useCancelRewards } from "@hooks/useCancelRewards";
import { useContestStore } from "@hooks/useContest/store";
import useRewardsModule from "@hooks/useRewards";
import { useRewardsStore } from "@hooks/useRewards/store";
import { compareVersions } from "compare-versions";
import { ModuleType } from "lib/rewards";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Abi } from "viem";
import { useAccount, useAccountEffect } from "wagmi";
import CreateRewardsModule from "./components/CreateRewardsModule";
import NoRewardsInfo from "./components/NoRewards";
import VotersRewardsPage from "./modules/Voters";
import WinnersRewardsPage from "./modules/Winners";

const ContestRewards = () => {
  const asPath = usePathname();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const chainExplorer = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.blockExplorers?.default.url;

  const {
    isSuccess,
    isLoading,
    supportsRewardsModule,
    contestAuthorEthereumAddress,
    sortingEnabled,
    contestMaxProposalCount,
    rewardsModuleAddress,
    rewardsAbi,
    rewardsModuleType,
    version,
    downvotingAllowed,
  } = useContestStore(state => state);
  const [isFundRewardsOpen, setIsFundRewardsOpen] = useState(false);
  const [isWithdrawRewardsOpen, setIsWithdrawRewardsOpen] = useState(false);
  const rewardsStore = useRewardsStore(state => state);
  const { getContestRewardsModule } = useRewardsModule();
  const { address: accountAddress } = useAccount();
  const creator = contestAuthorEthereumAddress === accountAddress;
  const githubLink = FOOTER_LINKS.find(link => link.label === "Github");
  const {
    isCanceled,
    isLoading: isRewardsCanceledLoading,
    isSuccess: isRewardsCanceledSuccess,
  } = useCancelRewards({
    rewardsAddress: rewardsStore.rewards.contractAddress as `0x${string}`,
    abi: rewardsStore.rewards.abi,
    chainId,
    version,
  });
  const hasCanceledFunction = compareVersions(version, REWARDS_CANCELED_VERSION) >= 0;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });

  useEffect(() => {
    if (rewardsStore?.isSuccess) return;
    if (supportsRewardsModule) getContestRewardsModule();
  }, [rewardsStore?.isSuccess, supportsRewardsModule]);

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

  return (
    <div className="animate-reveal">
      {!isLoading && isSuccess && (
        <>
          {rewardsStore.isLoading && <Loader>Loading rewards</Loader>}
          {rewardsStore.isSuccess &&
            (rewardsModuleType === ModuleType.VOTER_REWARDS ? (
              <VotersRewardsPage
                rewardsModuleAbi={rewardsAbi as Abi}
                contestAddress={contestAddress as `0x${string}`}
                chainId={chainId}
                contestRewardsModuleAddress={rewardsModuleAddress as `0x${string}`}
              />
            ) : rewardsModuleType === ModuleType.AUTHOR_REWARDS ? (
              <WinnersRewardsPage />
            ) : null)}

          <DialogAddFundsToRewardsModule isOpen={isFundRewardsOpen} setIsOpen={setIsFundRewardsOpen} />
        </>
      )}
    </div>
  );
};

export default ContestRewards;
