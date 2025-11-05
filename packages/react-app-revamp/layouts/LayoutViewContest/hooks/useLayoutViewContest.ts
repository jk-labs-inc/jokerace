/* eslint-disable react-hooks/exhaustive-deps */
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { useAccountChange } from "@hooks/useAccountChange";
import { ContractConfig, useContest } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useContestStatusStore } from "@hooks/useContestStatus/store";
import { useContestStatusTimer } from "@hooks/useContestStatusTimer";
import useRewardsModule from "@hooks/useRewards";
import useUser from "@hooks/useUserSubmitQualification";
import { VOTE_AND_EARN_VERSION } from "@hooks/useUserSubmitQualification/utils";
import { compareVersions } from "compare-versions";
import { useEffect } from "react";
import { useAccountEffect } from "wagmi";

const OFAC_SEARCH_URL = "https://www.google.com/search?q=what+are+ofac+sanctions";

/**
 * Hook that orchestrates all initialization logic and side effects for the contest layout.
 * Returns all state and data needed by the component.
 */
export const useLayoutViewContest = () => {
  const { contestConfig } = useContestConfigStore(state => state);
  const { isLoading, fetchContestInfo, isSuccess, error } = useContest();
  const {
    contestAuthorEthereumAddress,
    contestName,
    isReadOnly,
    contestPrompt,
    canEditTitleAndDescription,
    submissionsOpen,
    votesClose,
    votesOpen,
  } = useContestStore(state => state);
  const { accountChanged, resetAccountChanged } = useAccountChange();
  const { checkIfCurrentUserQualifyToSubmit } = useUser();
  const { setContestStatus } = useContestStatusStore(state => state);
  const {
    data: rewardsModule,
    isLoading: isRewardsModuleLoading,
    isSuccess: isRewardsModuleSuccess,
    isError: isRewardsModuleError,
    isRefetching: isRewardsModuleRefetching,
  } = useRewardsModule();
  const contestStatus = useContestStatusTimer({
    submissionsOpen,
    votesOpen,
    votesClose,
    isLoading,
  });

  // OFAC address check
  useAccountEffect({
    onConnect(data) {
      if (ofacAddresses.includes(data.address)) {
        window.location.href = OFAC_SEARCH_URL;
      }
    },
  });

  // Update contest status when it changes
  useEffect(() => {
    setContestStatus(contestStatus);
  }, [contestStatus, setContestStatus]);

  // Fetch user qualification when account changes
  useEffect(() => {
    if (
      isLoading ||
      !isSuccess ||
      !accountChanged ||
      compareVersions(contestConfig.version, VOTE_AND_EARN_VERSION) <= 0
    )
      return;

    const fetchUserData = async () => {
      const contractConfig: ContractConfig = {
        address: contestConfig.address as `0x${string}`,
        abi: contestConfig.abi,
        chainId: contestConfig.chainId,
      };
      await checkIfCurrentUserQualifyToSubmit(contractConfig);

      resetAccountChanged();
    };

    fetchUserData();
  }, [accountChanged, isLoading, isSuccess, contestConfig.version]);

  // Fetch contest info when chain or address changes
  useEffect(() => {
    fetchContestInfo();
  }, [contestConfig.chainName, contestConfig.address]);

  return {
    contestConfig,
    rewardsModule,
    isLoading: isRewardsModuleLoading || isRewardsModuleRefetching || isLoading,
    isSuccess: isSuccess && isRewardsModuleSuccess,
    error,
    contestAuthorEthereumAddress,
    contestName,
    isReadOnly,
    contestPrompt,
    canEditTitleAndDescription,
  };
};
