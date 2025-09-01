import { useSubmissionMerkle } from "@components/_pages/Create/hooks/useSubmissionMerkle";
import { ContestType } from "@components/_pages/Create/types";
import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import { isSupabaseConfigured } from "@helpers/database";
import { setupDeploymentClients } from "@helpers/viem";
import useEmailSignup from "@hooks/useEmailSignup";
import { useError } from "@hooks/useError";
import { differenceInSeconds, getUnixTime } from "date-fns";
import { parseEther, PublicClient, WalletClient } from "viem";
import { useAccount } from "wagmi";
import { saveFilesToBucket } from "./buckets";
import { isSortingEnabled } from "./contracts";
import { checkForSpoofing, getJkLabsSplitDestinationAddress, indexContest } from "./database";
import { createMetadataFieldsSchema } from "./helpers";
import { useDeployContestStore } from "./store";
import { PriceCurveType, SplitFeeDestinationType, VoteType } from "./types";

export const MAX_SUBMISSIONS_LIMIT = 1000;
export const JK_LABS_SPLIT_DESTINATION_DEFAULT = "0xDc652C746A8F85e18Ce632d97c6118e8a52fa738";

const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useDeployContest() {
  const { subscribeUser, checkIfEmailExists } = useEmailSignup();
  const {
    title,
    prompt,
    contestType,
    submissionOpen,
    votingOpen,
    votingClose,
    customization,
    advancedOptions,
    setDeployContestData,
    votingRequirements,
    metadataFields,
    entryPreviewConfig,
    emailSubscriptionAddress,
    charge,
    priceCurve,
    setIsLoading,
    setIsSuccess,
  } = useDeployContestStore(state => state);
  const { handleError } = useError();
  const { address, chain } = useAccount();
  const { processCreatorAllowlist } = useSubmissionMerkle();

  async function prepareForDeployment() {
    if (contestType === ContestType.VotingContest) {
      try {
        await processCreatorAllowlist(address);
      } catch (error) {
        handleError(error, "Something went wrong while processing creator allowlist.");
        throw error;
      }
    }

    let client: WalletClient;
    let userAddress: `0x${string}`;
    let publicClient: PublicClient;

    try {
      const { walletClient, publicClient: pubClient, account } = await setupDeploymentClients(chain?.id ?? 1);

      if (!walletClient || !pubClient || !account) {
        handleError(new Error("Failed to setup deployment clients"), "Failed to setup deployment clients");
        throw new Error("Failed to setup deployment clients");
      }

      client = walletClient;
      userAddress = account;
      publicClient = pubClient;
    } catch (error: any) {
      handleError(error, "Please try reconnecting your wallet.");
      throw error;
    }

    const currentState = useDeployContestStore.getState();
    const currentVotingMerkleData = currentState.votingMerkle;
    const currentSubmissionMerkleData = currentState.submissionMerkle;

    const isSpoofingDetected = await checkForSpoofing(
      userAddress,
      currentVotingMerkleData,
      currentSubmissionMerkleData,
    );

    if (isSpoofingDetected) {
      toastError({
        message: "Spoofing detected! None shall pass.",
      });
      throw new Error("Spoofing detected");
    }

    return {
      client,
      publicClient,
      votingMerkleData: currentVotingMerkleData,
      submissionMerkleData: currentSubmissionMerkleData,
    };
  }

  async function deployContest() {
    setIsLoading(true);
    toastLoading({
      message: "contest is deploying...",
    });

    let preparationResult;
    try {
      preparationResult = await prepareForDeployment();
    } catch (error) {
      setIsLoading(false);
      return;
    }

    const {
      client,
      publicClient,
      votingMerkleData: currentVotingMerkleData,
      submissionMerkleData: currentSubmissionMerkleData,
    } = preparationResult;

    try {
      const [address] = await client.getAddresses();

      const combinedPrompt = new URLSearchParams({
        type: contestType,
        summarize: prompt.summarize,
        evaluateVoters: prompt.evaluateVoters,
        contactDetails: prompt.contactDetails ?? "",
        imageUrl: prompt.imageUrl ?? "",
      }).toString();

      const votingMerkle = currentVotingMerkleData.prefilled || currentVotingMerkleData.csv;
      const submissionMerkle = currentSubmissionMerkleData;
      const { type: chargeType, percentageToCreator } = charge;
      const { merkleRoot: submissionMerkleRoot = EMPTY_ROOT } = submissionMerkle || {};

      const { merkleRoot: votingMerkleRoot = EMPTY_ROOT } = votingMerkle || {};
      const { allowedSubmissionsPerUser, maxSubmissions } = customization;
      let jkLabsSplitDestination = "";

      // Handle allowedSubmissionsPerUser and maxSubmissions in case they are not set, they are zero, or we pass "infinity" to the contract
      const finalAllowedSubmissionsPerUser =
        !isNaN(allowedSubmissionsPerUser) && allowedSubmissionsPerUser > 0
          ? allowedSubmissionsPerUser
          : MAX_SUBMISSIONS_LIMIT;
      const finalMaxSubmissions = !isNaN(maxSubmissions) && maxSubmissions > 0 ? maxSubmissions : MAX_SUBMISSIONS_LIMIT;

      try {
        jkLabsSplitDestination = await getJkLabsSplitDestinationAddress(chain?.id ?? 0, {
          costToPropose: chargeType.costToPropose,
          costToVote: chargeType.costToVote,
        });
      } catch (error) {
        toastError({
          message: "Failed to fetch JK Labs split destination. Please try again later.",
        });
        setIsLoading(false);
        return;
      }

      const intConstructorArgs = {
        contestStart: getUnixTime(submissionOpen),
        votingDelay: differenceInSeconds(votingOpen, submissionOpen),
        votingPeriod: differenceInSeconds(votingClose, votingOpen),
        numAllowedProposalSubmissions: finalAllowedSubmissionsPerUser,
        maxProposalCount: finalMaxSubmissions,
        sortingEnabled: 1,
        rankLimit: advancedOptions.rankLimit,
        percentageToCreator: percentageToCreator,
        costToPropose: parseEther(chargeType.costToPropose.toString()),
        costToVote: parseEther(chargeType.costToVote.toString()),
        payPerVote: charge.voteType === VoteType.PerVote ? 1 : 0,
        priceCurveType: priceCurve.type === PriceCurveType.Flat ? 0 : 1,
        multiple: priceCurve.type === PriceCurveType.Flat ? 1 : parseEther(priceCurve.multiple.toString()),
      };

      const constructorArgs = {
        intConstructorArgs,
        creatorSplitDestination:
          charge.splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet
            ? client.account?.address
            : charge.splitFeeDestination.type === SplitFeeDestinationType.NoSplit
            ? jkLabsSplitDestination || JK_LABS_SPLIT_DESTINATION_DEFAULT
            : charge.splitFeeDestination.address,
        jkLabsSplitDestination: jkLabsSplitDestination || JK_LABS_SPLIT_DESTINATION_DEFAULT,
        metadataFieldsSchema: createMetadataFieldsSchema(metadataFields, entryPreviewConfig),
      };

      const contractDeploymentHash = await client.deployContract({
        abi: DeployedContestContract.abi,
        bytecode: DeployedContestContract.bytecode.object as `0x${string}`,
        args: [title, combinedPrompt, submissionMerkleRoot, votingMerkleRoot, constructorArgs],
        account: address,
        chain: chain,
      });

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: contractDeploymentHash,
      });

      const contractAddress = receipt?.contractAddress;

      if (!contractAddress) {
        throw new Error("Contract deployment failed - no contract address returned");
      }

      const sortingEnabled = await isSortingEnabled(contractAddress, chain?.id ?? 0);

      setDeployContestData(
        chain?.name ?? "",
        chain?.id ?? 0,
        contractDeploymentHash,
        contractAddress.toLowerCase(),
        sortingEnabled,
      );

      let votingReqDatabaseEntry = null;

      if (currentVotingMerkleData.prefilled) {
        votingReqDatabaseEntry = {
          type: votingRequirements.type,
          tokenAddress: votingRequirements.tokenAddress,
          chain: votingRequirements.chain,
          description: `${votingRequirements.powerValue} per ${votingRequirements.powerType}`,
          minTokensRequired: votingRequirements.minTokensRequired,
          timestamp: votingRequirements.timestamp,
        };
      }

      const contestData = {
        title: title,
        type: contestType,
        prompt: combinedPrompt,
        datetimeOpeningSubmissions: submissionOpen,
        datetimeOpeningVoting: votingOpen,
        datetimeClosingVoting: votingClose,
        contractAddress: contractAddress.toLowerCase(),
        votingMerkleRoot: votingMerkle?.merkleRoot ?? EMPTY_ROOT,
        submissionMerkleRoot: submissionMerkle?.merkleRoot ?? EMPTY_ROOT,
        authorAddress: address,
        networkName: chain?.name.toLowerCase().replace(" ", "") ?? "",
        voting_requirements: votingReqDatabaseEntry,
        cost_to_propose: chargeType.costToPropose,
        cost_to_vote: chargeType.costToVote,
        percentage_to_creator: percentageToCreator,
      };

      await subscribeToEmail(emailSubscriptionAddress);

      try {
        await saveFilesToBucket(votingMerkle, submissionMerkle);
      } catch (e) {
        handleError(e, "Something went wrong while saving files to bucket.");
        setIsLoading(false);
        throw e;
      }

      try {
        await indexContest(contestData, votingMerkle, submissionMerkle);
      } catch (e) {
        setIsLoading(false);
        toastError({
          message: "contest deployment failed to index in db",
        });
        throw e;
      }

      toastSuccess({
        message: "contest has been deployed!",
      });
      setIsSuccess(true);
      setIsLoading(false);
    } catch (e) {
      console.error("Failed to deploy contest:", e);
      handleError(e, "Something went wrong and the contest couldn't be deployed.");
      setIsLoading(false);
    }
  }

  async function subscribeToEmail(emailAddress: string) {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured");
    }

    if (!emailAddress) {
      return;
    }

    const emailExists = await checkIfEmailExists({ emailAddress, userAddress: address, displayToasts: false });

    if (emailExists || !address) {
      return;
    }

    await subscribeUser(emailAddress, address, false);
  }

  return {
    deployContest,
    prepareForDeployment,
  };
}
