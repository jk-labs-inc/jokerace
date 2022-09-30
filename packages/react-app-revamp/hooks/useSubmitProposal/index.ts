import toast from "react-hot-toast";
import { writeContract, waitForTransaction, getAccount, fetchEnsName } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreSubmitProposal } from "./store";
import { useStore as useStoreContest } from "./../useContest/store";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import getContestContractVersion from "@helpers/getContestContractVersion";
import useContestProposalsIndex from "@hooks/useContestProposalsIndex";
import isUrlToImage from "@helpers/isUrlToImage";
import { chain as wagmiChain } from "wagmi";
export function useSubmitProposal() {
  const { indexProposal } = useContestProposalsIndex();
  const {
    //@ts-ignore
    increaseCurrentUserProposalCount,
    //@ts-ignore
    setProposalData,
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
      contractInterface: abi ?? DeployedContestContract.abi,
    };
    try {
      const txSendProposal = await writeContract({
        ...contractConfig,
        functionName: "propose",
        args: proposalContent,
      });

      const txReceipt = await txSendProposal.wait();
      //@ts-ignore
      const proposalId = txReceipt?.events?.[0]?.args?.proposalId;
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

      const accountData = await getAccount();
      const authorEthAddress = accountData?.address;
      const ens = await fetchEnsName({
        //@ts-ignore
        address: authorEthAddress,
        chainId: wagmiChain.mainnet.id,
      });
      const proposalData = {
        author: ens ?? accountData.address,
        content: proposalContent,
        isContentImage: isUrlToImage(proposalContent) ? true : false,
        exists: true,
        //@ts-ignore
        votes: 0,
      };
      setProposalData({ id: proposalId, data: proposalData });

      indexProposal({
        id: proposalId.toString(),
        contestNetworkName: chainName,
        contestAddress: address,
        authorAddress: authorEthAddress,
        content: proposalContent,
        isContentImage: isUrlToImage(proposalContent),
        exists: true,
      });
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
