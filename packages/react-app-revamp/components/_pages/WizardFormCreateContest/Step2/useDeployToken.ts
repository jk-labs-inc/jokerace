import DeployedGenericVotesTimestampTokenContract from "@contracts/bytecodeAndAbi/GenericVotesTimestampToken.sol/GenericVotesTimestampToken.json";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import { waitForTransaction } from "@wagmi/core";
import { ContractFactory } from "ethers";
import { parseEther } from "ethers/lib/utils";
import toast from "react-hot-toast";
import { CustomError } from "types/error";
import { useNetwork, useSigner } from "wagmi";
import { useStore } from "../store";

export function useDeployToken(form: any) {
  const stateContractDeployment = useContractFactoryStore(state => state);
  const { chain } = useNetwork();
  const { refetch } = useSigner();
  const {
    setDeploySubmissionTokenData,
    modalDeploySubmissionTokenOpen,
    modalDeployTokenOpen,
    setTokenDeployedToChain,
    setModalDeployTokenOpen,
    setDeployTokenData,
  } = useStore(state => ({
    //@ts-ignore
    setTokenDeployedToChain: state.setTokenDeployedToChain,
    //@ts-ignore
    setModalDeployTokenOpen: state.setModalDeployTokenOpen,
    //@ts-ignore
    setDeployTokenData: state.setDeployTokenData,
    //@ts-ignore
    modalDeployTokenOpen: state.modalDeployTokenOpen,
    //@ts-ignore
    modalDeploySubmissionTokenOpen: state.modalDeploySubmissionTokenOpen,
    //@ts-ignore
    setDeploySubmissionTokenData: state.setDeploySubmissionTokenData,
  }));

  async function handleSubmitForm(values: any, isDeployingSubmissionToken: boolean) {
    stateContractDeployment.setIsSuccess(false);
    stateContractDeployment.setError(null);

    //@ts-ignore
    setTokenDeployedToChain(chain);
    setModalDeployTokenOpen(true);
    stateContractDeployment.setIsLoading(true);

    try {
      // we need to refetch the signer, otherwise an error is triggered
      const signer = await refetch();
      const factory = new ContractFactory(
        DeployedGenericVotesTimestampTokenContract.abi,
        DeployedGenericVotesTimestampTokenContract.bytecode,
        //@ts-ignore
        signer.data,
      );
      const contract = await factory.deploy(
        values.tokenName,
        values.tokenSymbol,
        values.receivingAddress,
        parseEther(`${values.numberOfTokens}`),
        values?.nonTransferable ?? false,
      );
      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: contract.deployTransaction.hash,
      });
      stateContractDeployment.setIsSuccess(true);
      if (isDeployingSubmissionToken === true) {
        setDeploySubmissionTokenData({
          hash: receipt.transactionHash,
          address: contract.address,
        });
      } else {
        setDeployTokenData({
          hash: receipt.transactionHash,
          address: contract.address,
        });
      }
      if (modalDeployTokenOpen === false && modalDeploySubmissionTokenOpen === false) {
        toast.success(
          `The contract for your token ${values.tokenName} ($${values.tokenSymbol}) was deployed successfully!`,
        );
      }
      stateContractDeployment.setIsLoading(false);
      stateContractDeployment.setIsSuccess(true);
      stateContractDeployment.setError(null);
      form.reset();
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;
      if (!modalDeployTokenOpen && !modalDeploySubmissionTokenOpen) {
        const message =
          customError?.message ||
          `The contract for your token ${values.tokenName} ($${values.tokenSymbol}) couldn't be deployed.`;
        toast.error(message);
        stateContractDeployment.setError({
          code: customError.code,
          message,
        });
        stateContractDeployment.setIsLoading(false);
      }
    }
  }

  return {
    handleSubmitForm,
    stateContractDeployment,
  };
}

export default useDeployToken;
