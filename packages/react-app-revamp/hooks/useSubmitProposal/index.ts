import toast from "react-hot-toast";
import { writeContract, waitForTransaction } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreSubmitProposal } from "./store";
import { useStore as useStoreContest } from "./../useContest/store";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import getContestContractVersion from "@helpers/getContestContractVersion";

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
  const { chain } = useNetwork();
  const { asPath } = useRouter();

  async function sendProposal(proposalContent: string) {
    const address = asPath.split("/")[3];
    const chainName = asPath.split("/")[2];
    const abi = await getContestContractVersion(address, chainName);
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      addressOrName: address,
      contractInterface: abi ? abi : DeployedContestContract.abi,
    };
    try {
      const txSendProposal = await writeContract({
        ...contractConfig,
        functionName: "propose",
        args: proposalContent,
      });

      const receipt = await waitForTransaction({
        chainId: chain?.id,
        //@ts-ignore
        hash: txSendProposal.hash,
      });
      setTransactionData({
        chainId: chain?.id,
        hash: receipt.transactionHash,
        //@ts-ignore
        transactionHref: `${chain.blockExplorers?.default?.url}/tx/${txSendProposal?.hash}`,
      });
      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Your proposal was deployed successfully!`);
      increaseCurrentUserProposalCount();
    } catch (e) {
      //@ts-ignore
      toast.error(e?.message);
      setError(e);
      setIsLoading(false);
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
