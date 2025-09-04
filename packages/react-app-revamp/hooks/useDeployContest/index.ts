import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import { isSupabaseConfigured } from "@helpers/database";
import useEmailSignup from "@hooks/useEmailSignup";
import { useError } from "@hooks/useError";
import { useAccount } from "wagmi";
import { isSortingEnabled } from "./contracts";
import { getJkLabsSplitDestinationAddress, indexContest } from "./database";
import { prepareConstructorArgs } from "./helpers/constructorArgs";
import { prepareContestData } from "./helpers/contestData";
import { prepareForDeployment } from "./helpers/deploymentPreparation";
import { useDeployContestStore } from "./store";

export const MAX_SUBMISSIONS_LIMIT = 1000;
export const JK_LABS_SPLIT_DESTINATION_DEFAULT = "0xDc652C746A8F85e18Ce632d97c6118e8a52fa738";

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

  async function deployContest() {
    setIsLoading(true);
    toastLoading({
      message: "contest is deploying...",
    });

    if (!address || !chain) {
      handleError(new Error("Failed to prepare for deployment"), "Failed to prepare for deployment");
      setIsLoading(false);
      return;
    }

    let preparationResult;
    try {
      preparationResult = await prepareForDeployment({
        address: address as `0x${string}`,
        chainId: chain.id,
      });
    } catch (error: any) {
      handleError(error, error.userMessage || "Failed to prepare for deployment");
      setIsLoading(false);
      return;
    }

    const { client, publicClient } = preparationResult;

    try {
      const combinedPrompt = new URLSearchParams({
        type: contestType,
        summarize: prompt.summarize,
        evaluateVoters: prompt.evaluateVoters,
        contactDetails: prompt.contactDetails ?? "",
        imageUrl: prompt.imageUrl ?? "",
      }).toString();

      const { type: chargeType } = charge;
      let jkLabsSplitDestination = "";

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

      const constructorArgs = prepareConstructorArgs({
        title,
        combinedPrompt,
        contestType,
        submissionOpen,
        votingOpen,
        votingClose,
        customization,
        advancedOptions,
        charge,
        priceCurve,
        metadataFields,
        entryPreviewConfig,
        clientAccountAddress: client.account?.address,
        jkLabsSplitDestination,
      });

      const contractDeploymentHash = await client.deployContract({
        abi: DeployedContestContract.abi,
        bytecode: DeployedContestContract.bytecode.object as `0x${string}`,
        args: [constructorArgs],
        account: address as `0x${string}`,
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

      const contestData = prepareContestData({
        constructorArgs,
        title,
        contestType,
        combinedPrompt,
        submissionOpen,
        votingOpen,
        votingClose,
        contractAddress,
        address,
        chainName: chain?.name,
        chargeType,
        charge,
      });

      await subscribeToEmail(emailSubscriptionAddress);

      try {
        await indexContest(contestData);
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
  };
}
