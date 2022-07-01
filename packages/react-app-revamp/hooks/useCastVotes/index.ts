import toast from "react-hot-toast";
import { writeContract, waitForTransaction } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreCastVotes } from "./store";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { parseEther, parseUnits } from "ethers/lib/utils";
import useContest from "@hooks/useContest";

export function useCastVotes() {
  const {
    //@ts-ignore
    pickedProposal,
    //@ts-ignore
    isLoading,
    //@ts-ignore
    isSuccess,
    //@ts-ignore
    error,
    //@ts-ignore
    setIsLoading,
    //@ts-ignore
    setIsSuccess,
    //@ts-ignore
    setError,
    //@ts-ignore
    setTransactionData,
  } = useStoreCastVotes();
  const { activeChain } = useNetwork();
  const { asPath } = useRouter();
  const { updateCurrentUserVotes } = useContest();

  async function castVotes(amount: number) {
    const address = asPath.split("/")[3];
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    };
    try {
      // args are (*in this order!*): proposalId, support, numVotes

      const txCastVotes = await writeContract(contractConfig, "castVote", {
        args: [pickedProposal, parseEther("0"), parseUnits(`${amount}`)],
      });
      const receipt = await waitForTransaction({
        chainId: activeChain?.id,
        //@ts-ignore
        hash: txCastVotes.hash,
        //@ts-ignore
        transactionHref: `${activeChain.blockExplorers?.default?.url}/tx/${txCastVotes?.hash}`,
      });
      setTransactionData({
        hash: receipt.transactionHash,
      });
      await updateCurrentUserVotes();

      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Your votes were cast successfully!`);
    } catch (e) {
      toast.error(
        //@ts-ignore
        e?.data?.message ?? "Something went wrong while casting your votes.",
      );
      console.error(e);
      setIsLoading(false);
      setError(e);
    }
  }

  return {
    setTransactionData,
    castVotes,
    isLoading,
    isSuccess,
    error,
  };
}

export default useCastVotes;
