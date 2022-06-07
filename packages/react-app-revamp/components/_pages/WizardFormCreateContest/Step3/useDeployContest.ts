import { ContractFactory } from "ethers";
import toast from "react-hot-toast";
import { useNetwork, useSigner } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { parseEther } from "ethers/lib/utils";
import { getUnixTime, differenceInSeconds } from "date-fns";
import { useContractFactory } from "@hooks/useContractFactory";
//@ts-ignore
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";

import { useStore } from "../store";

export function useDeployContest(form) {
  const stateContestDeployment = useContractFactory();
  const { activeChain } = useNetwork();
  const { refetch } = useSigner();
  const stateWizardForm = useStore();

  async function handleSubmitForm(values: any) {
    stateWizardForm.setContestDeployedToChain(activeChain); // in case
    stateWizardForm.setModalDeployContestOpen(true);
    stateContestDeployment.setIsLoading(true);
    stateContestDeployment.setIsSuccess(false);
    stateContestDeployment.setIsError(false);
    stateContestDeployment.setErrorMessage(null);

    try {
      // we need to refetch the signer, otherwise an error is triggered
      const signer = await refetch();
      const factory = new ContractFactory(DeployedContestContract.abi, DeployedContestContract.bytecode, signer.data);

      const chosenContestVotingSnapshot =
        values.usersQualifyToVoteIfTheyHoldTokenOnVoteStart === true
          ? getUnixTime(new Date(values.datetimeOpeningVoting))
          : getUnixTime(new Date(values.usersQualifyToVoteAtAnotherDatetime));
      const proposalThreshold = values.submissionOpenToAll ? 0 : values.requiredNumberOfTokenToSubmit;
      const numAllowedProposalSubmissions =
        values.noSubmissionLimitPerUser === true ? 10000000 : values.submissionPerUserMaxNumber;
      const contestParameters = [
        // UNIX timestamp of when submissions open
        getUnixTime(new Date(values.datetimeOpeningSubmissions)),
        // how many seconds will submissions be open
        differenceInSeconds(new Date(values.datetimeOpeningVoting), new Date(values.datetimeOpeningSubmissions)),
        // how many seconds will voting be open
        differenceInSeconds(new Date(values.datetimeClosingVoting), new Date(values.datetimeOpeningVoting)),
        // UNIX timestamp of the snapshot that will determine voting power
        chosenContestVotingSnapshot,
        // amount of tokens the user needs to submit an entry (0 if open to all)
        parseEther(`${proposalThreshold}`),
        // how many entries can a wallet with the required tokens submit
        numAllowedProposalSubmissions,
        // max proposal count: the maximum number of submissions the contest will show
        values?.submissionMaxNumber,
      ];

      const contract = await factory.deploy(
        // @TODO: add description field (value.contestDescription)
        values.contestTitle,
        values.votingTokenAddress,
        contestParameters,
      );
      const receipt = await waitForTransaction({
        chainId: activeChain?.id,
        hash: contract.deployTransaction.hash,
      });
      stateContestDeployment.setIsSuccess(true);
      stateWizardForm.setDeployContestData({
        hash: receipt.transactionHash,
        address: contract.address,
      });
      if (stateWizardForm.modalDeployContestOpen === false)
        toast.success(`The contract for your contest ("${values.contestTitle}") was deployed successfully`);

      stateContestDeployment.setIsLoading(false);
      form.reset();
    } catch (e) {
      console.error(e);
      if (stateWizardForm.modalDeployContestOpen === false)
        toast.error(`The contract for your contest ("${values.contestTitle}") couldn't be deployed.`);
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

export default useDeployContest;
