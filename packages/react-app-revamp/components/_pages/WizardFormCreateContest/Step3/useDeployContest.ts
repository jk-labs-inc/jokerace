import shallow from "zustand/shallow";
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

export function useDeployContest(form: any) {
  const stateContestDeployment = useContractFactory();
  const { activeChain } = useNetwork();
  const { refetch } = useSigner();
  //@ts-ignore
  const {
    modalDeployContestOpen,
    setModalDeployContestOpen,
    setDeployContestData,
    setContestDeployedToChain,
  } = useStore(
    state => ({
      //@ts-ignore
      modalDeployContestOpen: state.modalDeployContestOpen,
      //@ts-ignore
      setModalDeployContestOpen: state.setModalDeployContestOpen,
      //@ts-ignore
      setModalDeployContestOpen: state.setModalDeployContestOpen,
      //@ts-ignore
      setDeployContestData: state.setDeployContestData,
      //@ts-ignore
      setContestDeployedToChain: state.setContestDeployedToChain,
    }),
    shallow,
  );

  async function handleSubmitForm(values: any) {
    setContestDeployedToChain(activeChain);
    setModalDeployContestOpen(true);
    stateContestDeployment.setIsLoading(true);
    stateContestDeployment.setIsSuccess(false);
    stateContestDeployment.setIsError(false);
    stateContestDeployment.setErrorMessage(null);

    try {
      // we need to refetch the signer, otherwise an error is triggered
      const signer = await refetch();
      //@ts-ignore
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
        values.contestTitle,
        values.contestDescription,
        values.votingTokenAddress,
        contestParameters,
      );
      const receipt = await waitForTransaction({
        chainId: activeChain?.id,
        hash: contract.deployTransaction.hash,
      });
      stateContestDeployment.setIsSuccess(true);
      setDeployContestData({
        hash: receipt.transactionHash,
        address: contract.address,
      });
      if (modalDeployContestOpen === false)
        toast.success(`The contract for your contest ("${values.contestTitle}") was deployed successfully!`);

      stateContestDeployment.setIsLoading(false);
      form.reset();
    } catch (e) {
      console.error(e);
      if (modalDeployContestOpen === false)
        toast.error(`The contract for your contest ("${values.contestTitle}") couldn't be deployed.`);
      stateContestDeployment.setIsError(true);
      //@ts-ignore
      stateContestDeployment.setErrorMessage(e?.message);
      stateContestDeployment.setIsLoading(false);
    }
  }

  return {
    handleSubmitForm,
    stateContestDeployment,
  };
}

export default useDeployContest;
