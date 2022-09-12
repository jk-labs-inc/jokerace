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
import useContestsIndex from "@hooks/useContestsIndex";

export function useDeployContest(form: any) {
  const { indexContest } = useContestsIndex();
  const stateContestDeployment = useContractFactory();
  const { chain } = useNetwork();
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
    setContestDeployedToChain(chain);
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
      const proposalThreshold = values?.whoCanSubmit === "anybody" ? 0 : values.requiredNumberOfTokenToSubmit;
      const numAllowedProposalSubmissions =
        values.noSubmissionLimitPerUser === true ? 10000000 : values.submissionPerUserMaxNumber;
      const useSameTokenForSubmissions = ["anybody", "mustHaveVotingTokens"].includes(values?.whoCanSubmit)
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
        // downvoting: is downvoting allowed in this contest
        // 0 = false; 1 = true
        values?.downvotingAllowed === true ? 1 : 0,
        // same tokens: if this contest allows proposals to be sent for holders of the voting token or of another token
        // 0 = false; 1 = true
        useSameTokenForSubmissions === true ? 1 : 0,
      ];

      const contract = await factory.deploy(
        values.contestTitle,
        values.contestDescription,
        values.votingTokenAddress,
        useSameTokenForSubmissions === true ? values.votingTokenAddress : values.submissionTokenAddress,
        contestParameters,
      );
      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: contract.deployTransaction.hash,
      });
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        indexContest({
          ...values,
          contractAddress: contract.address,
          networkName: chain?.name.toLowerCase().replace(" ", ""),
        });
      }

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
