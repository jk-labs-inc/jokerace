import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { LoadingToastMessageType } from "@components/UI/Toast/components/Loading";
import { chains, config } from "@config/wagmi";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { extractPathSegments } from "@helpers/extractPath";
import { getProposalId } from "@helpers/getProposalId";
import { generateEntryPreviewHTML, generateFieldInputsHTML, processFieldInputs } from "@helpers/metadata";
import { useContestStore } from "@hooks/useContest/store";
import { Charge } from "@hooks/useDeployContest/types";
import { useEmailSend } from "@hooks/useEmailSend";
import { useError } from "@hooks/useError";
import { useGenerateProof } from "@hooks/useGenerateProof";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useRewardsModule from "@hooks/useRewards";
import { useTotalRewards } from "@hooks/useTotalRewards";
import { useUserStore } from "@hooks/useUser/store";
import { VOTE_AND_EARN_VERSION } from "@hooks/useUser/utils";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { EmailType } from "lib/email/types";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useSubmitProposalStore } from "./store";

const targetMetadata = {
  targetAddress: "0x0000000000000000000000000000000000000000",
};

const safeMetadata = {
  signers: ["0x0000000000000000000000000000000000000000"],
  threshold: 1,
};

interface UserAnalyticsParams {
  address: string;
  userAddress: `0x${string}` | undefined;
  chainName: string;
  proposalId: string;
  charge: Charge;
}

interface RewardsAnalyticsParams {
  isEarningsTowardsRewards: boolean;
  address: string;
  rewardsModuleAddress: string;
  charge: Charge;
  chainName: string;
  amount: number;
  operation: "deposit" | "withdraw";
  token_address: string | null;
}

interface CombinedAnalyticsParams extends UserAnalyticsParams, RewardsAnalyticsParams {}

export function useSubmitProposal() {
  const { address: userAddress, chain } = useAccount();
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(chain => chain.name.toLowerCase() === chainName.toLowerCase())[0]?.id;
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const showToast = !isMobile;
  const {
    charge,
    contestAbi: abi,
    version,
    rewardsModuleAddress,
    votesOpen,
    votesClose,
  } = useContestStore(state => state);
  const { data: rewards } = useRewardsModule();
  const { error: errorMessage, handleError } = useError();
  const { fetchSingleProposal } = useProposal();
  const { setSubmissionsCount, submissionsCount } = useProposalStore(state => state);
  const { increaseCurrentUserProposalCount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
  const { fields: metadataFields, setFields: setMetadataFields } = useMetadataStore(state => state);
  const isEarningsTowardsRewards = rewardsModuleAddress === charge.splitFeeDestination.address;
  const { refetch: refetchTotalRewards } = useTotalRewards({
    rewardsModuleAddress: rewards?.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewards?.abi,
    chainId,
  });
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const formattedVotesClose = moment(votesClose).format("MMMM Do, h:mm a");
  const { sendEmail } = useEmailSend();

  const calculateChargeAmount = () => {
    return BigInt(charge.type.costToPropose);
  };

  const getContractConfig = () => {
    return {
      address: address as `0x${string}`,
      abi: abi,
      chainId: chainId,
    };
  };

  async function sendProposal(proposalContent: string): Promise<{ tx: TransactionResponse; proposalId: string }> {
    if (showToast)
      toastLoading({
        message: "proposal is deploying...",
        additionalMessageType: LoadingToastMessageType.KEEP_BROWSER_OPEN,
      });
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    const isVoteAndEarnVersion = compareVersions(version, VOTE_AND_EARN_VERSION) >= 0;

    // generate the entry preview HTML
    const entryPreviewHTML = generateEntryPreviewHTML(metadataFields);

    // generate the HTML for field inputs
    const fieldInputsHTML = generateFieldInputsHTML(proposalContent, metadataFields);

    // combine the original proposalContent with the generated HTML
    const fullProposalContent = `${entryPreviewHTML}\n\n${proposalContent}\n\n${fieldInputsHTML}`;

    return new Promise<{ tx: TransactionResponse; proposalId: string }>(async (resolve, reject) => {
      const costToPropose = calculateChargeAmount();

      try {
        let proofs, isVerified;

        // Only generate proofs if it's NOT the vote-and-earn version
        if (!isVoteAndEarnVersion) {
          const proofsResult = await getProofs(userAddress ?? "", "submission", "10");
          proofs = proofsResult.proofs;
          isVerified = proofsResult.isVerified;
        }

        const contractConfig = {
          address: address as `0x${string}`,
          abi: abi,
          chainId,
        };

        const fieldsMetadata = processFieldInputs(metadataFields);
        const proposalCore = {
          author: userAddress,
          exists: true,
          description: fullProposalContent,
          targetMetadata: targetMetadata,
          safeMetadata: safeMetadata,
          fieldsMetadata: fieldsMetadata,
        };

        let hash: `0x${string}`;

        try {
          if (isVoteAndEarnVersion) {
            // For vote-and-earn version, always use propose
            const { request } = await simulateContract(config, {
              ...contractConfig,
              functionName: "propose",
              args: [proposalCore],
              value: costToPropose,
            });
            hash = await writeContract(config, request);
          } else if (!isVerified) {
            // For older versions with unverified users, use propose with proofs to verify them
            const { request } = await simulateContract(config, {
              ...contractConfig,
              functionName: "propose",
              args: [proposalCore, proofs],
              value: costToPropose,
            });
            hash = await writeContract(config, request);
          } else {
            // For older versions with verified users, use proposeWithoutProof
            const { request } = await simulateContract(config, {
              ...contractConfig,
              functionName: "proposeWithoutProof",
              args: [proposalCore],
              value: costToPropose,
            });
            hash = await writeContract(config, request);
          }
        } catch (simulationError: any) {
          throw new Error(`transaction simulation failed: ${simulationError.message}`);
        }

        const receipt = await waitForTransactionReceipt(config, {
          chainId: chainId,
          hash: hash,
        });

        const txSendProposal = {
          hash: receipt.transactionHash,
        } as TransactionResponse;

        const proposalId = await getProposalId(proposalCore, contractConfig);
        const contestEntryLink = `${
          window.location.origin
        }/contest/${chainName.toLowerCase()}/${address}/submission/${proposalId}`;

        setTransactionData({
          chainId: chainId,
          hash: receipt.transactionHash,
          transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${hash}`,
        });

        await performAnalytics({
          address,
          userAddress,
          chainName,
          proposalId,
          charge,
          isEarningsTowardsRewards,
          rewardsModuleAddress,
          amount: costToPropose ? Number(formatEther(costToPropose)) : 0,
          operation: "deposit",
          token_address: null,
        });

        await fetchSingleProposal(getContractConfig(), version, proposalId);

        setIsLoading(false);
        setIsSuccess(true);
        if (showToast)
          toastSuccess({
            message: "proposal submitted successfully!",
          });
        await sendEntryEmail(contestEntryLink);
        increaseCurrentUserProposalCount();
        setSubmissionsCount(submissionsCount + 1);

        if (metadataFields.length > 0) {
          const clearedFields = metadataFields.map(field => ({
            ...field,
            inputValue: "",
          }));
          setMetadataFields(clearedFields);
        }

        resolve({ tx: txSendProposal, proposalId });
      } catch (e) {
        handleError(e, `Something went wrong while submitting your proposal.`);
        setError(errorMessage);
        setIsLoading(false);
      }
    });
  }

  async function addUserActionAnalytics(params: UserAnalyticsParams) {
    try {
      await addUserActionForAnalytics({
        contest_address: params.address,
        user_address: params.userAddress,
        network_name: params.chainName,
        proposal_id: params.proposalId,
        created_at: Math.floor(Date.now() / 1000),
        amount_sent: params.charge.type.costToPropose
          ? Number(formatEther(BigInt(params.charge.type.costToPropose)))
          : null,
        percentage_to_creator: params.charge.percentageToCreator,
      });
    } catch (error) {
      console.error("Error in addUserActionForAnalytics:", error);
    }
  }

  async function updateRewardAnalyticsIfNeeded(params: RewardsAnalyticsParams) {
    if (params.isEarningsTowardsRewards) {
      try {
        await updateRewardAnalytics({
          contest_address: params.address,
          rewards_module_address: params.rewardsModuleAddress,
          network_name: params.chainName,
          amount: params.charge.type.costToPropose
            ? Number(formatEther(BigInt(params.charge.type.costToPropose))) * (params.charge.percentageToCreator / 100)
            : 0,
          operation: "deposit",
          token_address: null,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
      refetchTotalRewards();
    }
  }

  async function performAnalytics(params: CombinedAnalyticsParams) {
    try {
      await addUserActionAnalytics(params);
      await updateRewardAnalyticsIfNeeded(params);
    } catch (error) {
      console.error("Error in performAnalytics:", error);
    }
  }

  async function sendEntryEmail(contestEntryLink: string) {
    await sendEmail(userAddress ?? "", EmailType.EntryEmail, {
      contest_entry_link: contestEntryLink,
      contest_voting_open_date: formattedVotesOpen,
      contest_end_date: formattedVotesClose,
    });
  }

  return {
    sendProposal,
    isLoading,
    isSuccess,
    error,
  };
}

export default useSubmitProposal;
