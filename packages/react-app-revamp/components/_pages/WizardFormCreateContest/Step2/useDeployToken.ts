import { ContractFactory } from "ethers";
import { parseEther } from "ethers/lib/utils";
import toast from "react-hot-toast";
import { useNetwork, useSigner } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { useContractFactory } from "@hooks/useContractFactory";
//@ts-ignore
import DeployedGenericVotesTimestampTokenContract from "@contracts/bytecodeAndAbi/GenericVotesTimestampToken.sol/GenericVotesTimestampToken.json";
import { useStore } from "../store";
import type { WizardFormState } from '../store'

export function useDeployToken(form: any) {
  const stateContractDeployment = useContractFactory();
  const { activeChain } = useNetwork();
  const { refetch } = useSigner();
  //@ts-ignore
  const stateWizardForm: WizardFormState= useStore();

  async function handleSubmitForm(values: any) {
    //@ts-ignore
    stateWizardForm.setTokenDeployedToChain(activeChain);
    stateWizardForm.setModalDeployTokenOpen(true);
    stateContractDeployment.setIsLoading(true);
    stateContractDeployment.setIsSuccess(false);
    stateContractDeployment.setIsError(false);
    stateContractDeployment.setErrorMessage(null);

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
        chainId: activeChain?.id,
        hash: contract.deployTransaction.hash,
      });
      stateContractDeployment.setIsSuccess(true);
      stateWizardForm.setDeployTokenData({
        hash: receipt.transactionHash,
        address: contract.address,
      });
      if (stateWizardForm.modalDeployTokenOpen === false)
        toast.success(
          `The contract for your token ${values.tokenName} ($${values.tokenSymbol}) was deployed successfully`,
        );

      stateContractDeployment.setIsLoading(false);
      form.reset();
    } catch (e) {
      console.error(e);
      if (stateWizardForm.modalDeployTokenOpen === false)
        toast.error(`The contract for your token ${values.tokenName} ($${values.tokenSymbol}) couldn't be deployed.`);
      stateContractDeployment.setIsError(true);
      //@ts-ignore
      stateContractDeployment.setErrorMessage(e.message);
      stateContractDeployment.setIsLoading(false);
    }
  }

  return {
    handleSubmitForm,
    stateContractDeployment,
  };
}

export default useDeployToken;
