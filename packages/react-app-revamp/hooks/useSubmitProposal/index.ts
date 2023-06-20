import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useUserStore } from "@hooks/useUser/store";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useSubmitProposalStore } from "./store";

export function useSubmitProposal() {
  const { increaseCurrentUserProposalCount } = useUserStore(state => state);

  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
  const { chain } = useNetwork();
  const { asPath } = useRouter();

  async function sendProposal(proposalContent: string) {
    const [chainName, address] = asPath.split("/").slice(2, 4);
    const { abi, version } = await getContestContractVersion(address, chainName);

    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);

    try {
      const contractConfig = {
        addressOrName: address,
        contractInterface: abi || DeployedContestContract.abi,
      };

      const txSendProposal = await writeContract({
        ...contractConfig,
        functionName: "propose",
        args: [proposalContent],
      });

      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txSendProposal.hash,
      });

      setTransactionData({
        chainId: chain?.id,
        hash: receipt.transactionHash,
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txSendProposal?.hash}`,
      });

      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Your proposal was deployed successfully!`);
      increaseCurrentUserProposalCount();
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      const message = customError.message || "Something went wrong while submitting your proposal.";
      toast.error(message);
      setError({
        code: customError.code,
        message,
      });
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
