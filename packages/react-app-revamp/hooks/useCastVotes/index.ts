import toast from "react-hot-toast";
import { writeContract, waitForTransaction } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreCastVotes } from "./store";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { parseEther, parseUnits } from "ethers/lib/utils";
import useContest from "@hooks/useContest";
import getContestContractVersion from "@helpers/getContestContractVersion";

export function useCastVotes() {
  const {
    //@ts-ignore
    castPositiveAmountOfVotes,
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
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const { updateCurrentUserVotes } = useContest();

  async function castVotes(amount: number, isPositive: boolean) {
    const address = asPath.split("/")[3];
    const abi = await getContestContractVersion(address);
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      addressOrName: address,
      contractInterface: abi ? abi : DeployedContestContract.abi,
    };
    try {
      // args are (*in this order!*): proposalId, support, numVotes

      const txCastVotes = await writeContract({
        ...contractConfig,
        functionName: "castVote",
        args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amount}`)],
      });
      const receipt = await waitForTransaction({
        chainId: chain?.id,
        //@ts-ignore
        hash: txCastVotes.hash,
        //@ts-ignore
        transactionHref: `${chain.blockExplorers?.default?.url}/tx/${txCastVotes?.hash}`,
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
    castPositiveAmountOfVotes,
  };
}

export default useCastVotes;
