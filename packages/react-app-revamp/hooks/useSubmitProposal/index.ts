import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useNetwork } from "wagmi";
import { useStore as useStoreContest } from "./../useContest/store";
import { useSubmitProposalStore } from "./store";

export function useSubmitProposal() {
  const {
    //@ts-ignore
    increaseCurrentUserProposalCount,
  } = useStoreContest();

  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
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
      if (!e) return;
      //@ts-ignore
      const message = e?.message;
      toast.error(message);
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
