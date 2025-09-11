import { config } from "@config/wagmi";
import { ContractConfig } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { readContract, readContracts } from "@wagmi/core";
import { AnyoneCanSubmit, useUserStore } from "./store";
import { VOTE_AND_EARN_VERSION } from "./utils";
import { compareVersions } from "compare-versions";

export const useSubmitQualification = (userAddress: `0x${string}` | undefined) => {
  const { contestAuthorEthereumAddress } = useContestStore(state => state);
  const {
    setCurrentUserQualifiedToSubmit,
    setCurrentUserProposalCount,
    setIsCurrentUserSubmitQualificationLoading,
    setIsCurrentUserSubmitQualificationSuccess,
    setIsCurrentUserSubmitQualificationError,
    setAnyoneCanSubmit,
  } = useUserStore(state => state);

  const setLoadingState = (loading: boolean, success: boolean = false, error: boolean = false) => {
    setIsCurrentUserSubmitQualificationLoading(loading);
    setIsCurrentUserSubmitQualificationSuccess(success);
    setIsCurrentUserSubmitQualificationError(error);
  };

  const handleSubmissionCountCheck = async (
    contractConfig: ContractConfig,
    contestMaxNumberSubmissionsPerUser: number,
    canSubmit: boolean,
  ) => {
    if (!canSubmit) {
      setCurrentUserQualifiedToSubmit(false);
      setLoadingState(false, true);
      return;
    }

    try {
      const numOfSubmittedProposalsRaw = (await readContract(config, {
        ...contractConfig,
        functionName: "numSubmissions",
        args: [userAddress as `0x${string}`],
      })) as bigint;

      const numOfSubmittedProposals = Number(numOfSubmittedProposalsRaw.toString());
      setCurrentUserProposalCount(numOfSubmittedProposals);

      const hasReachedLimit =
        numOfSubmittedProposals > 0 && numOfSubmittedProposals >= contestMaxNumberSubmissionsPerUser;

      if (hasReachedLimit) {
        setLoadingState(false, true);
        return;
      }

      setCurrentUserQualifiedToSubmit(true);
      setLoadingState(false, true);
    } catch (error) {
      setCurrentUserQualifiedToSubmit(false);
      setLoadingState(false, false, true);
    }
  };

  const checkIfCurrentUserQualifyToSubmit = async (contractConfig: ContractConfig) => {
    if (!userAddress) return;

    setLoadingState(true);

    if (!contractConfig.abi) {
      setLoadingState(false, false, true);
      return;
    }

    const results = await readContracts(config, {
      contracts: [
        {
          ...contractConfig,
          functionName: "anyoneCanSubmit",
          args: [],
        },
        {
          ...contractConfig,
          functionName: "numAllowedProposalSubmissions",
          args: [],
        },
      ],
    });

    const anyoneCanSubmitResult = Number(results[0].result);
    const contestMaxNumberSubmissionsPerUser = Number(results[1].result);
    const anyoneCanSubmit = anyoneCanSubmitResult === 1;

    setAnyoneCanSubmit(anyoneCanSubmit ? AnyoneCanSubmit.ANYONE_CAN_SUBMIT : AnyoneCanSubmit.ONLY_CREATOR);

    const canSubmit = anyoneCanSubmit ? true : userAddress === contestAuthorEthereumAddress;

    await handleSubmissionCountCheck(contractConfig, contestMaxNumberSubmissionsPerUser, canSubmit);
  };

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
};
