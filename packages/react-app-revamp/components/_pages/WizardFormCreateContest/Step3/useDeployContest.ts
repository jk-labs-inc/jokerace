import shallow from "zustand/shallow";
import { ContractFactory } from "ethers";
import toast from "react-hot-toast";
import { useNetwork, useSigner } from "wagmi";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { parseEther } from "ethers/lib/utils";
import { getUnixTime, differenceInSeconds } from "date-fns";
import { useContractFactory } from "@hooks/useContractFactory";
//@ts-ignore
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { useStore } from "../store";
import useContestsIndex from "@hooks/useContestsIndex";
import { useMutation } from "@tanstack/react-query";
import { makeStorageClient } from "@config/web3storage";

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
    setDeployRewardsModule,
    setContestRewardsModule,
    setWillHaveRewardsModule,
  } = useStore(
    state => ({
      //@ts-ignore
      setWillHaveRewardsModule: state.setWillHaveRewardsModule,
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
      //@ts-ignore
      setDeployRewardsModule: state.setDeployRewardsModule,
      //@ts-ignore
      setContestRewardsModule: state.setContestRewardsModule,
    }),
    shallow,
  );

/**
   * Upload our image file to IPFS (using web3 storage)
   */
const mutationUploadImageFile = useMutation(async (file) => {
  try {
    const client = makeStorageClient()
    //@ts-ignore
    const cid = await client.put([file])
    return cid
  } catch (e) {
    console.error(e)
    //@ts-ignore
    toast.error(e?.message ?? e)
  }
})

  async function handleSubmitForm(values: any) {
    const hasRewards = ["erc20", "native"].includes(values.rewardsType);
    setWillHaveRewardsModule(hasRewards);
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
      const factoryCreateContest = new ContractFactory(
        DeployedContestContract.abi,
        DeployedContestContract.bytecode,
        //@ts-ignore
        signer.data,
      );
      const chosenContestVotingSnapshot =
        values.usersQualifyToVoteIfTheyHoldTokenOnVoteStart === true
          ? getUnixTime(new Date(values.datetimeOpeningVoting))
          : getUnixTime(new Date(values.usersQualifyToVoteAtAnotherDatetime));
      const proposalThreshold = values?.whoCanSubmit === "anybody" ? 0 : values.requiredNumberOfTokenToSubmit;
      const numAllowedProposalSubmissions =
        values.noSubmissionLimitPerUser === true ? 10000000 : values.submissionPerUserMaxNumber;
      const useSameTokenForSubmissions = ["anybody", "mustHaveVotingTokens"].includes(values?.whoCanSubmit);
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

      const contractContest = await factoryCreateContest.deploy(
        values.contestTitle,
        values.contestDescription,
        values.votingTokenAddress,
        useSameTokenForSubmissions === true ? values.votingTokenAddress : values.submissionTokenAddress,
        contestParameters,
      );

      const receiptDeployContest = await waitForTransaction({
        chainId: chain?.id,
        hash: contractContest.deployTransaction.hash,
      });

      setDeployContestData({
        hash: receiptDeployContest.transactionHash,
        address: contractContest.address,
      });

      if (hasRewards) {
        //@ts-ignore
        const factoryCreateRewardsModule = new ContractFactory(
          RewardsModuleContract.abi,
          RewardsModuleContract.bytecode,
          //@ts-ignore
          signer.data,
        );
        const rewardsRanks = values.rewards.map((reward: any) => parseInt(reward.winningRank));
        const totalRewardsAmount = values.rewards.reduce((sumRewards: number, reward: any) => {
          return sumRewards + reward.rewardTokenAmount;
        }, 0);
        const rewardsShares = values.rewards.map(
          (reward: any) => reward.rewardTokenAmount * 100000000, // be able to handle decimals
        );

        // Deploy the rewards module
        const contractRewardsModule = await factoryCreateRewardsModule.deploy(
          rewardsRanks,
          rewardsShares,
          //@ts-ignore
          contractContest.address,
        );

        const receiptDeployRewardsModule = await waitForTransaction({
          chainId: chain?.id,
          //@ts-ignore
          hash: contractRewardsModule.deployTransaction.hash,
        });

        setDeployRewardsModule({
          hash: receiptDeployRewardsModule.transactionHash,
          address: contractRewardsModule.address,
        });

        const contractConfig = {
          addressOrName: contractContest.address,
          contractInterface: DeployedContestContract.abi,
        };
        const txSetRewardsModule = await writeContract({
          ...contractConfig,
          functionName: "setOfficialRewardsModule",
          //@ts-ignore
          args: contractRewardsModule.address,
        });

        const receiptSetContestRewardsModule = await waitForTransaction({
          chainId: chain?.id,
          //@ts-ignore
          hash: txSetRewardsModule.hash,
        });
        setContestRewardsModule({
          rewardsModuleAddress: contractRewardsModule.address,
          tokenRewardsAddress: values.rewardsType === "erc20" ? values?.rewardTokenAddress : "native",
          rewardsTotalAmount: totalRewardsAmount,
          hash: receiptSetContestRewardsModule.transactionHash,
        });
      }
      console.log(values?.contestImageFile)

      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        let cid = null
        if(values?.contestImageFile && process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN && process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN !== "") cid = await mutationUploadImageFile.mutateAsync(values?.contestImageFile)  
        indexContest({
          ...values,
          contractAddress: contractContest.address,
          networkName: chain?.name.toLowerCase().replace(" ", ""),
          coverSrc: cid !== null ? `ipfs://${cid}/${values?.contestImageFile?.name}` : cid,
        });
      }

      stateContestDeployment.setIsSuccess(true);

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
