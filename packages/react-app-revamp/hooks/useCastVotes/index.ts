import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { useEthersProvider } from "@helpers/ethers";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { prepareWriteContract, waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { CustomError, ErrorCodes } from "types/error";
import { parseUnits } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { useCastVotesStore } from "./store";

export function useCastVotes() {
  const { votingMerkleTree } = useContestStore(state => state);
  const {
    castPositiveAmountOfVotes,
    pickedProposal,
    isLoading,
    isSuccess,
    error,
    setIsLoading,
    setIsSuccess,
    setError,
    setTransactionData,
  } = useCastVotesStore(state => state);
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const { updateCurrentUserVotes } = useUser();
  const { currentUserTotalVotesAmount } = useUserStore(state => state);
  const { checkIfProofIsVerified } = useGenerateProof();
  const [id, chainId] = [asPath.split("/")[3], asPath.split("/")[2]];
  const provider = useEthersProvider({ chainId: parseFloat(chainId) });

  async function castVotes(amount: number, isPositive: boolean) {
    const { abi } = await getContestContractVersion(id, provider);

    toastLoading("votes are deploying...");
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      address: id as `0x${string}`,
      abi: abi ? abi : DeployedContestContract.abi,
    };

    try {
      const proofsVerificationStatus = await checkIfProofIsVerified(
        votingMerkleTree,
        userAddress ?? "",
        "vote",
        currentUserTotalVotesAmount.toString(),
      );

      let txConfig = null;

      if (!proofsVerificationStatus.verified) {
        txConfig = await prepareWriteContract({
          ...contractConfig,
          functionName: "castVote",
          args: [
            pickedProposal,
            isPositive ? 0 : 1,
            parseUnits(currentUserTotalVotesAmount.toString(), 18),
            parseUnits(amount.toString(), 18),
            proofsVerificationStatus.proofs,
          ],
        });
      } else {
        txConfig = await prepareWriteContract({
          ...contractConfig,
          functionName: "castVoteWithoutProof",
          args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amount}`, 18)],
        });
      }

      let txCastVotes: any = {} as TransactionResponse;

      if (txConfig) {
        txCastVotes = await writeContract(txConfig);
      }

      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txCastVotes.hash,
        //@ts-ignore
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txCastVotes?.hash}`,
      });

      setTransactionData({
        hash: receipt.transactionHash,
      });

      await updateCurrentUserVotes();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess("your votes have been deployed successfully");
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        setIsLoading(false);
        throw customError;
      }

      toastError(`Something went wrong while casting your votes`, customError.message);
      setError({
        code: customError.code,
        message: customError.message,
      });
      setIsLoading(false);
      throw customError;
    }
  }

  return {
    setTransactionData,
    castVotes,
    isLoading,
    isSuccess,
    error,
    castPositiveAmountOfVotes,
  };
}

export default useCastVotes;
