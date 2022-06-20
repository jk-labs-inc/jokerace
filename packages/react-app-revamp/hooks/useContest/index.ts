import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { chain, useAccount, useConnect, useNetwork } from "wagmi";
import { fetchEnsName, fetchToken, readContract } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { chains } from "@config/wagmi";
import isUrlToImage from "@helpers/isUrlToImage";
import { useStore } from "./store";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";

export function useContest() {
  const { activeConnector } = useConnect();
  const { asPath, push, pathname } = useRouter();
  const { activeChain } = useNetwork();
  const account = useAccount();
  const [chainId, setChaindId] = useState(
    chains.filter(chain => chain.name.toLowerCase() === asPath.split("/")[2])?.[0]?.id,
  );
  const [address, setAddress] = useState(asPath.split("/")[3]);
  const {
    //@ts-ignore
    setContestName,
    //@ts-ignore
    setProposalData,
    //@ts-ignore
    setContestAuthor,
    //@ts-ignore
    setAmountOfTokensRequiredToSubmitEntry,
    //@ts-ignore
    setSubmissionsOpen,
    //@ts-ignore
    setContestStatus,
    //@ts-ignore
    setVotingTokenAddress,
    //@ts-ignore
    setVotingToken,
    //@ts-ignore
    setVotesOpen,
    //@ts-ignore
    setCurrentUserAvailableVotesAmount,
    //@ts-ignore
    setListProposalsIds,
    //@ts-ignore
    setIsError,
    //@ts-ignore
    setIsLoading,
    //@ts-ignore
    setIsListProposalsError,
    //@ts-ignore
    setIsListProposalsLoading,
    //@ts-ignore
    setVotesClose,
    //@ts-ignore
    isLoading,
    //@ts-ignore
    isListProposalsLoading,
    //@ts-ignore
    isError,
    //@ts-ignore
    isListProposalsError,
    //@ts-ignore
    isSuccess,
    //@ts-ignore
    setIsSuccess,
    //@ts-ignore
    isListProposalsSuccess,
    //@ts-ignore
    setIsListProposalsSuccess,
    //@ts-ignore
    resetListProposals,
  } = useStore();

  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = "This contract doesn't exist on this chain.";
    toast.error(toastMessage);
  }

  async function fetchContestInfo() {
    setIsLoading(true);
    setIsListProposalsLoading(true);
    try {
      const contractConfig = {
        addressOrName: address,
        contractInterface: DeployedContestContract.abi,
      };
      const contractBaseOptions = {};
      const contestNameRawData = await readContract(contractConfig, "name", contractBaseOptions);
      setContestName(contestNameRawData);

      const contestAuthorRawData = await readContract(contractConfig, "creator", contractBaseOptions);
      const contestAuthorEns = await fetchEnsName({
        //@ts-ignore
        address: contestAuthorRawData,
        chainId: chain.mainnet.id,
      });
      setContestAuthor(contestAuthorEns && contestAuthorEns !== null ? contestAuthorEns : contestNameRawData);

      const tokenAddressRawData = await readContract(contractConfig, "token", contractBaseOptions);
      setVotingTokenAddress(tokenAddressRawData);
      //@ts-ignore
      const tokenRawData = await fetchToken({ address: tokenAddressRawData, chainId });
      //@ts-ignore
      setVotingToken(tokenRawData);

      const contestStartRawData = await readContract(contractConfig, "contestStart", contractBaseOptions);
      //@ts-ignore
      setSubmissionsOpen(new Date(parseInt(contestStartRawData) * 1000));

      const deadlineRawData = await readContract(contractConfig, "contestDeadline", contractBaseOptions);
      //@ts-ignore
      setVotesClose(new Date(parseInt(deadlineRawData) * 1000));

      const votesOpenRawData = await readContract(contractConfig, "voteStart", contractBaseOptions);
      //@ts-ignore
      setVotesOpen(new Date(parseInt(votesOpenRawData) * 1000));

      const statusRawData = await readContract(contractConfig, "state", contractBaseOptions);
      setContestStatus(statusRawData);

      const amountOfTokensRequiredToSubmitEntryRawData = await readContract(
        contractConfig,
        "proposalThreshold",
        contractBaseOptions,
      );
      //@ts-ignore
      setAmountOfTokensRequiredToSubmitEntry(amountOfTokensRequiredToSubmitEntryRawData / 1e18);
      const usersQualifyToVoteIfTheyHoldTokenAtTimeRawData = await readContract(
        contractConfig,
        "contestSnapshot",
        contractBaseOptions,
      );
      //@ts-ignore
      setVotesOpen(new Date(parseInt(usersQualifyToVoteIfTheyHoldTokenAtTimeRawData) * 1000));

      const currentAddressTotalVotesRawData = await readContract(contractConfig, "contestAddressTotalVotesCast", {
        ...contractBaseOptions,
        args: account?.data?.address,
      });
      setCurrentUserAvailableVotesAmount(currentAddressTotalVotesRawData);

      if (pathname === ROUTE_CONTEST_PROPOSAL) {
        await fetchProposal(asPath.split("/")[4]);
      } else {
        const proposalsIdsRawData = await readContract(contractConfig, "getAllProposalIds", contractBaseOptions);
        setListProposalsIds(proposalsIdsRawData);
        if (proposalsIdsRawData.length === 0) {
          setIsListProposalsSuccess(true);
          setIsListProposalsLoading(false);
          setIsLoading(false);
          setIsError(null);
          setIsSuccess(true);
        } else {
          //@ts-ignore
          await fetchAllProposals(proposalsIdsRawData);
        }
      }
    } catch (e) {
      onContractError(e);
      //@ts-ignore
      setIsError(e?.code ?? e);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      console.error(e);
    }
  }

  async function fetchProposal(id: any) {
    const contractConfig = {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    };
    setIsListProposalsLoading(true);
    try {
      const proposalRawData = await readContract(contractConfig, "getProposal", {
        args: id,
      });
      const proposalVotesData = await readContract(contractConfig, "proposalVotes", {
        args: id,
      });

      const author = await fetchEnsName({
        address: proposalRawData[0],
        chainId: chain.mainnet.id,
      });

      const proposalData = {
        author: author ?? proposalRawData[0],
        content: proposalRawData[1],
        isContentImage: isUrlToImage(proposalRawData[1]) ? true : false,
        exists: proposalRawData[2],
        //@ts-ignore
        votes: proposalVotesData / 1e18,
      };

      setIsSuccess(true);
      setProposalData({ id, data: proposalData });
      setIsLoading(false);
      setIsError(null);
      setIsListProposalsLoading(false);
      setIsListProposalsError(null);
      setIsListProposalsSuccess(true);
    } catch (e) {
      onContractError(e);
      console.error(e);
      setIsLoading(false);
      setIsSuccess(false);
      //@ts-ignore
      setIsListProposalsError(e?.code ?? e);
      setIsListProposalsLoading(false);
    }
  }

  async function fetchAllProposals(list: Array<any>) {
    const contractConfig = {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    };
    setIsListProposalsLoading(true);
    try {
      await Promise.all(
        list.map(async (id: number) => {
          const proposalRawData = await readContract(contractConfig, "getProposal", {
            args: id,
          });
          const proposalVotesData = await readContract(contractConfig, "proposalVotes", {
            args: id,
          });

          const author = await fetchEnsName({
            address: proposalRawData[0],
            chainId: chain.mainnet.id,
          });
          const proposalData = {
            author: author ?? proposalRawData[0],
            content: proposalRawData[1],
            isContentImage: isUrlToImage(proposalRawData[1]) ? true : false,
            exists: proposalRawData[2],
            //@ts-ignore
            votes: proposalVotesData / 1e18,
          };
          setProposalData({ id, data: proposalData });
        }),
      );

      setIsListProposalsLoading(false);
      setIsListProposalsError(null);
      setIsListProposalsSuccess(true);

      setIsSuccess(true);
      setIsLoading(false);
      setIsError(null);
    } catch (e) {
      onContractError(e);
      console.error(e);
      setIsLoading(false);
      setIsSuccess(false);
      //@ts-ignore
      setIsListProposalsError(e?.code ?? e);
      setIsListProposalsLoading(false);
    }
  }

  useEffect(() => {
    if (activeChain?.id === chainId) {
      fetchContestInfo();
    } else {
      setIsLoading(false);
      setIsListProposalsLoading(false);
    }
  }, [activeChain?.id, chainId, asPath.split("/")[2], asPath.split("/")[3]]);

  useEffect(() => {
    const chainName = chains.filter(chain => chain.id === chainId)?.[0]?.name.toLowerCase();
    if (asPath.split("/")[2] !== chainName) {
      push(pathname, `/contest/${chainName}/${address}`, { shallow: true });
    }
  }, [chainId, address]);

  useEffect(() => {
    if (activeConnector) {
      activeConnector.on("change", data => {
        //@ts-ignore
        setChaindId(data.chain.id);
      });
    }
  }, [activeConnector]);

  return {
    chainId,
    fetchAllProposals,
    isLoading,
    isListProposalsLoading,
    isError,
    isListProposalsError,
    isSuccess,
    isListProposalsSuccess,
    retry: fetchContestInfo,
    onSearch: (addr: string) => {
      setIsLoading(true);
      setIsListProposalsLoading(true);
      setListProposalsIds([]);
      resetListProposals();
      setAddress(addr);
    },
  };
}

export default useContest;
