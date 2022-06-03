import { ContractFactory } from "ethers";
import { parseEther } from "ethers/lib/utils";
import toast from "react-hot-toast";
import { useNetwork, useSigner } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { useContractFactory } from "@hooks/useContractFactory";
//@ts-ignore
import DeployedGenericVotesTimestampTokenContract from "@contracts/bytecodeAndAbi/GenericVotesTimestampToken.sol/GenericVotesTimestampToken.json";
import { useStore } from "../store";

export function useDeployContest(form) {
  const stateContestDeployment = useContractFactory();
  const { activeChain } = useNetwork();
  const { refetch } = useSigner();
  const stateWizardForm = useStore();

  async function handleSubmitForm(values: any) {
    stateWizardForm.setTokenDeployedToChain(activeChain); // in case
    stateWizardForm.setModalDeployTokenOpen(true);
    stateContestDeployment.setIsLoading(true);
    stateContestDeployment.setIsSuccess(false);
    stateContestDeployment.setIsError(false);
    stateContestDeployment.setErrorMessage(null);

    try {
      // we need to refetch the signer, otherwise an error is triggered
      const signer = await refetch();
      const factory = new ContractFactory(
        DeployedGenericVotesTimestampTokenContract.abi,
        DeployedGenericVotesTimestampTokenContract.bytecode,
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
      stateContestDeployment.setIsSuccess(true);
      stateWizardForm.setDeployContestData({
        hash: receipt.transactionHash,
        //deployedTokenAddress: contract.address
      });
      // if(stateWizardForm.modalDeployContestOpen === false) toast.success(`The contract for your token ${values.tokenName} ($${values.tokenSymbol}) was deployed successfully`)

      stateContestDeployment.setIsLoading(false);
      form.reset();
    } catch (e) {
      console.error(e);
      // if(stateWizardForm.modalDeployContestOpen === false) toast.error(`The contract for your token ${values.tokenName} ($${values.tokenSymbol}) couldn't be deployed.`)
      stateContestDeployment.setIsError(true);
      stateContestDeployment.setErrorMessage(e.message);
      stateContestDeployment.setIsLoading(false);
    }
  }

  return {
    handleSubmitForm,
    stateContestDeployment,
  };
}

export default useDeployToken;
/*
export function useFormDeployToken() {
    const { refetch } = useSigner()
    const stateWizardForm = useStore();
  
    async function handleSubmitForm(values: any) {
        stateWizardForm.setModalDeployTokenOpen(true)
        stateWizardForm.setIsDeployTokenLoading(true)
        stateWizardForm.setIsDeployTokenSuccess(false)
        stateWizardForm.setIsDeployTokenError(false)
        stateWizardForm.setDeployTokenErrorMessage(null)
        try {
          const signer = await refetch()
          const factory = new ContractFactory(DeployedGenericVotesTimestampTokenContract.abi, DeployedGenericVotesTimestampTokenContract.bytecode, signer.data)    
          const contract = await factory.deploy(values.tokenName, values.tokenSymbol, values.receivingAddress, values.numberOfTokens, values?.isNontransferable ?? false);
          console.log(contract)
          stateWizardForm.setIsDeployTokenSuccess(true)
          stateWizardForm.setDeployTokenData({
            hash: contract.deployTransaction.hash,
            deployedTokenAddress: contract.address
          })
          console.log(stateWizardForm.data)
          stateWizardForm.setIsDeployTokenLoading(false)
        }
        catch(e) {
          console.error(e)
          stateWizardForm.setIsDeployTokenError(true)
          stateWizardForm.setDeployTokenErrorMessage(e.message)
          stateWizardForm.setIsDeployTokenLoading(false)
        }
      }
    
      return {
        handleSubmitForm
      }
}*/
