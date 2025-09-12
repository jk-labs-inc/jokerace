import { config } from "@config/wagmi";
import { ContractConfig } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { AnyoneCanSubmit, useUserStore } from "./store";
import { EMPTY_ROOT, VOTE_AND_EARN_VERSION } from "./utils";

export const useSubmitQualification = (
  userAddress: `0x${string}` | undefined,
  contestAddressLowerCase: string,
  lowerCaseChainName: string,
) => {
  const { setSubmissionsMerkleRoot } = useContestStore(state => state);
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

  const checkDatabaseQualification = async (
    contractConfig: ContractConfig,
    contestMaxNumberSubmissionsPerUser: number,
  ) => {
    try {
      const supabaseConfig = await import("@config/supabase");
      const supabase = supabaseConfig.supabase;

      const { data } = await supabase
        .from("contest_participants_v3")
        .select("can_submit")
        .eq("user_address", userAddress)
        .eq("contest_address", contestAddressLowerCase)
        .eq("network_name", lowerCaseChainName);

      const canSubmit = data && data.length > 0 && data[0].can_submit;
      await handleSubmissionCountCheck(contractConfig, contestMaxNumberSubmissionsPerUser, canSubmit);
    } catch (error) {
      console.error("Error performing lookup in 'contest_participants_v3':", error);
      setCurrentUserQualifiedToSubmit(false);
      setLoadingState(false, false, true);
    }
  };

  const checkIfCurrentUserQualifyToSubmit = async (contractConfig: ContractConfig, version: string) => {
    if (!userAddress) return;

    setLoadingState(true);

    if (!contractConfig.abi) {
      setLoadingState(false, false, true);
      return;
    }

    const isVoteAndEarnVersion = compareVersions(version, VOTE_AND_EARN_VERSION) >= 0;

    if (isVoteAndEarnVersion) {
      // Handle vote-and-earn version
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
          {
            ...contractConfig,
            functionName: "creator",
            args: [],
          },
        ],
      });

      const anyoneCanSubmitResult = Number(results[0].result);
      const contestMaxNumberSubmissionsPerUser = Number(results[1].result);
      const contestAuthorEthereumAddress = results[2].result as string;
      const anyoneCanSubmit = anyoneCanSubmitResult === 1;

      setAnyoneCanSubmit(anyoneCanSubmit ? AnyoneCanSubmit.ANYONE_CAN_SUBMIT : AnyoneCanSubmit.ONLY_CREATOR);

      const canSubmit = anyoneCanSubmit || userAddress === contestAuthorEthereumAddress;

      await handleSubmissionCountCheck(contractConfig, contestMaxNumberSubmissionsPerUser, canSubmit);
    } else {
      // Handle older versions with merkle root
      const results = await readContracts(config, {
        contracts: [
          {
            ...contractConfig,
            functionName: "submissionMerkleRoot",
            args: [],
          },
          {
            ...contractConfig,
            functionName: "numAllowedProposalSubmissions",
            args: [],
          },
        ],
      });

      const submissionMerkleRoot = results[0].result as string;
      const contestMaxNumberSubmissionsPerUser = Number(results[1].result);

      setSubmissionsMerkleRoot(submissionMerkleRoot);

      const anyoneCanSubmitWithMerkleRoot = submissionMerkleRoot === EMPTY_ROOT;

      if (anyoneCanSubmitWithMerkleRoot) {
        await handleSubmissionCountCheck(contractConfig, contestMaxNumberSubmissionsPerUser, true);
      } else {
        await checkDatabaseQualification(contractConfig, contestMaxNumberSubmissionsPerUser);
      }
    }
  };

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
};
