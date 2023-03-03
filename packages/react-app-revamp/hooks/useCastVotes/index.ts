import toast from "react-hot-toast";
import { writeContract, waitForTransaction } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useCastVotesStore } from "./store";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { parseUnits } from "ethers/lib/utils";
import useContest from "@hooks/useContest";
import getContestContractVersion from "@helpers/getContestContractVersion";

export function useCastVotes() {
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
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const { updateCurrentUserVotes } = useContest();

  async function castVotes(amount: number, isPositive: boolean) {
    const [id, chainId] = [asPath.split("/")[3], asPath.split("/")[2]];
    const abi = await getContestContractVersion(id, chainId);
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      addressOrName: id,
      contractInterface: abi ?? DeployedContestContract.abi,
    };
    try {
      const txCastVotes = await writeContract({
        ...contractConfig,
        functionName: "castVote",
        args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amount}`)],
      });
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
      toast.success(`Your votes were cast successfully!`);
    } catch (e) {
      //@ts-ignore
      toast.error(e?.message ?? "Something went wrong while casting your votes.");
      setIsLoading(false);
      //@ts-ignore
      setError(e?.message);
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
