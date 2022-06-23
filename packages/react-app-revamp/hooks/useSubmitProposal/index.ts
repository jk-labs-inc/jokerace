import toast from "react-hot-toast";
import { writeContract, waitForTransaction } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreSubmitProposal } from "./store";
import { useStore as useStoreContest } from "./../useContest/store";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";

export function useSubmitProposal() {
  const {
    //@ts-ignore
    increaseCurrentUserProposalCount,
  } = useStoreContest();

  const {
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
  } = useStoreSubmitProposal();
  const { activeChain } = useNetwork();
  const { asPath } = useRouter();

  async function sendProposal(proposalContent: string) {
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
      const txSendProposal = await writeContract(contractConfig, "propose", {
        args: proposalContent,
      });
      const receipt = await waitForTransaction({
        chainId: activeChain?.id,
        //@ts-ignore
        hash: txSendProposal.hash,
        //@ts-ignore
        transactionHref: `${activeChain.blockExplorers?.default?.url}/tx/${txSendProposal?.hash}`,
      });
      setTransactionData({
        chainId: activeChain?.id,
        hash: receipt.transactionHash,
      });
      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Your proposal was deployed successfully!`);
      increaseCurrentUserProposalCount();
    } catch (e) {
      toast.error(
        //@ts-ignore
        e?.data?.message ?? "Something went wrong while deploying your proposal. Please try again.",
      );
      console.error(e);
      setIsLoading(false);
      setError(e);
    }
  }

  return {
    sendProposal,
    isLoading,
    isSuccess,
    error,
  };
}

export default useSubmitProposal;
