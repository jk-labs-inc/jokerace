import { config } from "@config/wagmi";
import { ContractConfig } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { readContract, readContracts } from "@wagmi/core";
import { useUserStore } from "./store";
import { EMPTY_ROOT } from "./utils";

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
  } = useUserStore(state => state);

  const checkIfCurrentUserQualifyToSubmit = async (contractConfig: ContractConfig, version: string) => {
    setIsCurrentUserSubmitQualificationLoading(true);

    if (!contractConfig.abi) {
      setIsCurrentUserSubmitQualificationError(true);
      setIsCurrentUserSubmitQualificationLoading(false);
      return;
    }

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

    const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;

    setSubmissionsMerkleRoot(submissionMerkleRoot);

    if (!userAddress) return;

    if (anyoneCanSubmit) {
      try {
        const numOfSubmittedProposalsRaw = (await readContract(config, {
          ...contractConfig,
          functionName: "numSubmissions",
          args: [userAddress],
        })) as bigint;

        if (numOfSubmittedProposalsRaw > 0 && numOfSubmittedProposalsRaw >= contestMaxNumberSubmissionsPerUser) {
          setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
          return;
        }

        setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));
        setCurrentUserQualifiedToSubmit(true);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(true);
      } catch (error) {
        setIsCurrentUserSubmitQualificationError(true);
        setCurrentUserQualifiedToSubmit(false);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(false);
      }
    } else {
      const supabaseConfig = await import("@config/supabase");
      const supabase = supabaseConfig.supabase;
      try {
        const { data } = await supabase
          .from("contest_participants_v3")
          .select("can_submit")
          .eq("user_address", userAddress)
          .eq("contest_address", contestAddressLowerCase)
          .eq("network_name", lowerCaseChainName);

        if (data && data.length > 0 && data[0].can_submit) {
          const numOfSubmittedProposalsRaw = (await readContract(config, {
            ...contractConfig,
            functionName: "numSubmissions",
            args: [userAddress],
          })) as bigint;

          if (numOfSubmittedProposalsRaw > 0 && numOfSubmittedProposalsRaw >= contestMaxNumberSubmissionsPerUser) {
            setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));
            setIsCurrentUserSubmitQualificationLoading(false);
            setIsCurrentUserSubmitQualificationSuccess(true);
            return;
          }

          setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));

          setCurrentUserQualifiedToSubmit(true);
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
        } else {
          setCurrentUserQualifiedToSubmit(false);
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
        }
      } catch (error) {
        console.error("Error performing lookup in 'contest_participants_v3':", error);
        setIsCurrentUserSubmitQualificationError(true);
        setCurrentUserQualifiedToSubmit(false);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(false);
      }
    }
  };

  return {
    checkIfCurrentUserQualifyToSubmit,
  };
};
