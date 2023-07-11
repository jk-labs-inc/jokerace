import { toastError } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { readContract, readContracts } from "@wagmi/core";
import { differenceInHours, differenceInMilliseconds, hoursToMilliseconds, isBefore } from "date-fns";
import { generateMerkleTree, Recipient } from "lib/merkletree/generateMerkleTree";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useContestStore } from "./store";
import { getV1Contracts } from "./v1/contracts";
import { getV3Contracts } from "./v3/contracts";

interface ContractConfigResult {
  contractConfig: {
    addressOrName: string;
    contractInterface: any;
    chainId: number;
  };
  version: string;
}

export function useContest() {
  const { asPath } = useRouter();
  const { chain } = useNetwork();
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")[2])?.[0]?.id,
  );
  const [address, setAddress] = useState(asPath.split("/")[3]);
  const [chainName, setChainName] = useState(asPath.split("/")[2]);
  const {
    setError,
    isLoading,
    error,
    isSuccess,
    setIsSuccess,
    setIsLoading,
    setSupportsRewardsModule,
    setContestPrompt,
    setDownvotingAllowed,
    setContestName,
    setContestAuthor,
    setContestMaxProposalCount,
    setIsV3,
    setVotingMerkleTree,
    setVoters,
    setSubmitters,
    setTotalVotesCast,
    setTotalVotes,
    setSubmissionMerkleTree,
    setVotesClose,
    setVotesOpen,
    setSubmissionsOpen,
    setCanUpdateVotesInRealTime,
  } = useContestStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading, setListProposalsIds, resetListProposals } =
    useProposalStore(state => state);
  const { setContestMaxNumberSubmissionsPerUser, setIsLoading: setIsUserStoreLoading } = useUserStore(state => state);
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { fetchProposalsIdsList, fetchProposalsPage } = useProposal();
  const { contestStatus } = useContestStatusStore(state => state);

  /**
   * Display an error toast in the UI for any contract related error
   */
  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
    toast.error(toastMessage);
  }

  // Generate config for the contract
  async function getContractConfig(): Promise<ContractConfigResult | undefined> {
    try {
      const { abi, version } = await getContestContractVersion(address, chainName);

      if (abi === null) {
        toast.error(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
        setError({ message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.` });
        setIsSuccess(false);
        setIsListProposalsSuccess(false);
        setIsListProposalsLoading(false);
        setIsLoading(false);
        return;
      }

      const contractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId: chainId,
      };

      return { contractConfig, version };
    } catch (error) {}
  }

  /**
   * Fetch all info of a contest (title, prompt, list of proposals etc.)
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    setIsUserStoreLoading(true);
    const result = await getContractConfig();

    if (!result) return; // if the result is undefined, just return

    const { contractConfig, version } = result;

    if (
      contractConfig.contractInterface?.filter((el: { name: string }) => el.name === "officialRewardsModule").length > 0
    ) {
      const contestRewardModuleAddress = await readContract({
        ...contractConfig,
        functionName: "officialRewardsModule",
      });
      if (contestRewardModuleAddress.toString() == "0x0000000000000000000000000000000000000000") {
        setSupportsRewardsModule(false);
      } else {
        setSupportsRewardsModule(true);
      }
    } else {
      setSupportsRewardsModule(false);
    }

    if (version === "3.1") {
      try {
        const contracts = getV3Contracts(contractConfig);
        const results = await readContracts({ contracts });

        setIsV3(true);

        if (asPath.includes("/proposal/")) {
          await fetchProposalsPage(0, [asPath.split("/")[5]], 1);
        }

        await fetchProposalsIdsList(contractConfig.contractInterface);

        //@ts-ignore
        const closingVoteDate = new Date(parseInt(results[5]) * 1000);

        setContestName(results[0].toString());
        setContestAuthor(results[1].toString(), results[1].toString());

        const contestMaxNumberSubmissionsPerUser = parseFloat(results[2].toString());
        setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
        setContestMaxProposalCount(parseFloat(results[3].toString()));
        //@ts-ignore
        setSubmissionsOpen(new Date(parseInt(results[4]) * 1000));
        setVotesClose(closingVoteDate);
        //@ts-ignore
        setVotesOpen(new Date(parseInt(results[6]) * 1000));

        setContestPrompt(results[8].toString());

        setDownvotingAllowed(results[9].eq(1));

        // We want to track VoteCast event only 1H before the end of the contest
        if (isBefore(new Date(), closingVoteDate)) {
          if (differenceInHours(closingVoteDate, new Date()) <= 1) {
            // If the difference between the closing date (end of votes) and now is <= to 1h
            // reflect this in the state
            setCanUpdateVotesInRealTime(true);
          } else {
            setCanUpdateVotesInRealTime(false);
            // Otherwise, update the state 1h before the closing date (end of votes)
            const delayBeforeVotesCanBeUpdated =
              differenceInMilliseconds(closingVoteDate, new Date()) - hoursToMilliseconds(1);
            setTimeout(() => {
              setCanUpdateVotesInRealTime(true);
            }, delayBeforeVotesCanBeUpdated);
          }
        } else {
          setCanUpdateVotesInRealTime(false);
        }

        await processContestData(contestMaxNumberSubmissionsPerUser);
        setError(null);
        setIsSuccess(true);
        setIsLoading(false);
        setIsListProposalsLoading(false);
      } catch (error) {
        const customError = error as CustomError;
        if (!customError) return;

        setError(customError);
        toastError(customError.message ?? "Error while fetching contest data");
        setIsLoading(false);
        setIsListProposalsLoading(false);
      }
    } else {
      try {
        const contracts = getV1Contracts(contractConfig);
        const results = await readContracts({ contracts });

        setIsV3(false);

        // If current page is proposal, fetch proposal with id
        if (asPath.includes("/proposal/")) {
          await fetchProposalsPage(0, [asPath.split("/")[5]], 1);
        }

        // List of proposals for this contest
        await fetchProposalsIdsList(contractConfig.contractInterface);

        setContestName(results[0].toString());
        setContestAuthor(results[1].toString(), results[1].toString());
        //@ts-ignore
        setContestMaxNumberSubmissionsPerUser(results[2]);
        //@ts-ignore
        setContestMaxProposalCount(results[3]);

        //@ts-ignore
        const closingVoteDate = new Date(parseInt(results[6]) * 1000);

        //@ts-ignore
        setSubmissionsOpen(new Date(parseInt(results[5]) * 1000));
        //@ts-ignore
        setVotesOpen(new Date(parseInt(results[7]) * 1000));
        setVotesClose(closingVoteDate);

        setError(null);
        setIsSuccess(true);
        setIsLoading(false);
        setIsListProposalsLoading(false);

        //@ts-ignore
        const promptFilter = contractConfig.contractInterface?.filter(el => el.name === "prompt");
        //@ts-ignore
        const submissionGatingFilter = contractConfig.contractInterface?.filter(
          (el: { name: string }) => el.name === "submissionGatingByVotingToken",
        );
        //@ts-ignore
        const downvotingFilter = contractConfig.contractInterface?.filter(el => el.name === "downvotingAllowed");

        if (promptFilter.length > 0) {
          const indexToCheck = submissionGatingFilter.length > 0 ? 4 : downvotingFilter.length > 0 ? 2 : 1;
          setContestPrompt(results[contracts.length - indexToCheck].toString());
        }

        setDownvotingAllowed(
          downvotingFilter.length > 0
            ? parseInt(
                results[submissionGatingFilter.length > 0 ? contracts.length - 3 : contracts.length - 1].toString(),
              ) === 1
            : false,
        );
      } catch (e) {
        const customError = e as CustomError;

        if (!customError) return;

        onContractError(e);
        setError(customError);
        setIsSuccess(false);
        setIsListProposalsSuccess(false);
        setIsListProposalsLoading(false);
        setIsLoading(false);
      }
    }
  }

  /**
   * Fetch merkle tree data from DB and re-create the tree
   */
  async function processContestData(contestMaxNumberSubmissionsPerUser: number) {
    const { data } = await supabase
      .from("contests_v3")
      .select("submissionMerkleTree, votingMerkleTree")
      .eq("address", address)
      .eq("network_name", chainName);

    if (data && data.length > 0) {
      const { submissionMerkleTree: submissionMerkleTreeData, votingMerkleTree: votingMerkleTreeData } = data[0];

      let totalVotes = 0;
      const votesDataRecord: Record<string, number> = votingMerkleTreeData.voters.reduce(
        (acc: Record<string, number>, vote: Recipient) => {
          const numVotes = Number(vote.numVotes);
          acc[vote.address] = numVotes;
          totalVotes += numVotes;
          return acc;
        },
        {},
      );

      const votingMerkleTree = generateMerkleTree(18, votesDataRecord).merkleTree;
      setTotalVotes(totalVotes);
      setVoters(votingMerkleTreeData.voters);

      let submissionMerkleTree;

      if (
        !submissionMerkleTreeData ||
        submissionMerkleTreeData.merkleRoot === "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        submissionMerkleTree = generateMerkleTree(18, {}).merkleTree;
        setSubmitters([]);
      } else {
        const submissionsDataRecord: Record<string, number> = submissionMerkleTreeData.submitters.reduce(
          (acc: Record<string, number>, vote: Recipient) => {
            acc[vote.address] = Number(vote.numVotes);
            return acc;
          },
          {},
        );

        submissionMerkleTree = generateMerkleTree(18, submissionsDataRecord).merkleTree;
        setSubmitters(submissionMerkleTreeData.submitters);
      }

      if (contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed) {
        await fetchTotalVotesCast();
      }

      await checkIfCurrentUserQualifyToSubmit(submissionMerkleTree, contestMaxNumberSubmissionsPerUser);
      await checkIfCurrentUserQualifyToVote();

      setSubmissionMerkleTree(submissionMerkleTree);
      setVotingMerkleTree(votingMerkleTree);
    }
  }

  async function fetchTotalVotesCast() {
    try {
      const result = await getContractConfig();

      if (!result) return;

      const { contractConfig } = result;

      const totalVotesCast = await readContract({
        ...contractConfig,
        functionName: "totalVotesCast",
      });

      setTotalVotesCast(totalVotesCast ? Number(totalVotesCast) / 1e18 : 0);
    } catch {
      setTotalVotesCast(0);
    }
  }

  return {
    getContractConfig,
    onContractError,
    address,
    fetchContestInfo,
    fetchTotalVotesCast,
    setIsLoading,
    chainId,
    chainName,
    setChainId,
    isLoading,
    error,
    isSuccess,
    setChainName,
    retry: fetchContestInfo,
    onSearch: (addr: string, chainName: string) => {
      setChainName(chainName);
      setChainId(chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id);
      setIsLoading(true);
      setIsListProposalsLoading(true);
      setListProposalsIds([]);
      resetListProposals();
      setAddress(addr);
    },
  };
}

export default useContest;
