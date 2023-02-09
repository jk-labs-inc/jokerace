import { chains } from "@config/wagmi";
import shallow from "zustand/shallow";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { readContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { HEADERS_KEYS } from "@config/react-csv/export-contest";
import { createExportDataStore } from "./store";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useEffect } from "react";
import {
  useQuery,
} from "@tanstack/react-query"
import { makeStorageClient } from "@config/web3storage";
import { objectToCsv } from '@helpers/objectToCsv'

const MAX_PROPOSALS_EXPORTING = 500;
const MAX_UNIQUE_VOTERS_PER_PROPOSAL_EXPORTING = 500;
const PROPOSALS_PER_ASYNC_BATCH = 5; // 5 here
const VOTERS_PER_ASYNC_BATCH = 25; // and 100 here will usually keep you from getting rate-limited by Alchemy Growth tier (660 CUPS)

const useStoreExportData = createExportDataStore();

export function useExportContestDataToCSV() {
  const stateExportData = useStoreExportData();
  const { asPath } = useRouter();
  const queryContestResults = useQuery(
    ['contest-result', asPath.split("/")[3]],
    retrieveContestResultsCid
  )

  //@ts-ignore
  const { listProposalsData, listProposalsIds } = useStoreContest(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
      //@ts-ignore
      listProposalsIds: state.listProposalsIds,
    }),
    shallow,
  );

  async function retrieveContestResultsCid() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL !== '' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const config = await import('@config/supabase')
      const supabase = config.supabase

      try {
        const url = asPath.split("/");
        const contestAddress = url[3];
        const chainName = url[2];    
        const result = await supabase
        .from("results")
        .select("cid")
        .eq("contest_address", contestAddress)
        .eq("contest_network_name", chainName)

        const { data, error } = result
        if(error) {
          throw new Error(error.message)
        }
        
        if (data?.length > 0) {
          stateExportData.setCid(data[0]?.cid)
        }

        return data
      } catch(e) {
        console.error(e)
      }
    }
  }

  /**
   * Fetch the list of voters for a given proposal
   * @param proposalId - id of the proposal
   * @returns Array of voters addresses
   */
  async function fetchProposalVoters(proposalId: number | string) {
    const url = asPath.split("/");
    const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id;
    const address = url[3];
    const chainName = url[2];
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      return;
    }
    try {
      const contractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId: chainId,
      };
      //@ts-ignore
      const list = await readContract({
        ...contractConfig,
        functionName: "proposalAddressesHaveVoted",
        chainId,
        args: proposalId,
      });
      return list;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * fetch the amount of votes casted by a given address for a given proposal
   * @param id - id of the proposal
   * @param userAddress - ethereum address
   * @returns votes - amount of votes (forVotes - againstVotes for V2 contests ; votes for legacy contests)
   */
  async function fetchVotesPerAddress(id: number | string, userAddress: string) {
    const url = asPath.split("/");
    const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id;
    const address = url[3];
    const chainName = url[2];
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      return;
    }

    try {
      const data = await readContract({
        //@ts-ignore
        addressOrName: address,
        contractInterface: abi,
        functionName: "proposalAddressVotes",
        args: [id, userAddress],
        chainId,
      });
      //@ts-ignore
      return data?.forVotes ? data?.forVotes / 1e18 - data?.againstVotes / 1e18 : data / 1e18;
    } catch (e) {
      console.error(e);
    }
  }

  async function formatVoter(j: number, propId: number, propTotalVotes: number, propContent: string, proposerAddress: string, addressThatVoted: string) {
    const addressPropVote = await fetchVotesPerAddress(propId, addressThatVoted);

    const COMMON_DATA = {
      [HEADERS_KEYS.PROPOSAL_ID]: propId,
      [HEADERS_KEYS.AUTHOR]: proposerAddress,
      [HEADERS_KEYS.PROPOSAL_CONTENT]: propContent,
      [HEADERS_KEYS.TOTAL_VOTES]: propTotalVotes,
    };

    const voterDict = {
      ...COMMON_DATA,
      [HEADERS_KEYS.VOTER]: addressThatVoted,
      [HEADERS_KEYS.VOTES]: addressPropVote,
      //@ts-ignore
      [HEADERS_KEYS.PERCENT_OF_SUBMISSION_VOTES]: addressPropVote / propTotalVotes,
    };

    return voterDict;
  }

  async function formatProposal(i: number) {
    const propId = listProposalsIds[i];
    if (propId) {
      const propTotalVotes = listProposalsData[propId].votes;
      const propContent = "jokedao.io"+asPath.slice(0, asPath.indexOf("export-data"))+"proposal/"+propId.toString();
      const proposerAddress = listProposalsData[propId].authorEthereumAddress;
      const addressesVoted = await fetchProposalVoters(propId);

      const COMMON_DATA = {
        [HEADERS_KEYS.PROPOSAL_ID]: propId,
        [HEADERS_KEYS.AUTHOR]: proposerAddress,
        [HEADERS_KEYS.PROPOSAL_CONTENT]: propContent,
        [HEADERS_KEYS.TOTAL_VOTES]: propTotalVotes,
      };

      //@ts-ignore
      if (addressesVoted.length == 0) {
        const noVoterDict = {
          ...COMMON_DATA,
          [HEADERS_KEYS.VOTER]: "No voters",
          [HEADERS_KEYS.VOTES]: "No votes",
          [HEADERS_KEYS.PERCENT_OF_SUBMISSION_VOTES]: 0,
        };

        return [noVoterDict];
      }

      const arrayToReturn = [];
      //@ts-ignore
      for (let j = 0; j < Math.min(MAX_UNIQUE_VOTERS_PER_PROPOSAL_EXPORTING, addressesVoted.length); j++) {
        //@ts-ignore
        arrayToReturn.push(formatVoter(j, propId, propTotalVotes, propContent, proposerAddress, addressesVoted[j]));
        
        // Every VOTERS_PER_ASYNC_BATCH unique voters on a proposal, wait for all requests to return before sending out more
        // Motivation: to prevent rate-limiting by RPC providers
        if (j % VOTERS_PER_ASYNC_BATCH == 0) {
          await Promise.all(arrayToReturn);
        }
      }
      return await Promise.all(arrayToReturn);
    }
  }

  /**
   * Format the contest data and create a CSV file with those data
   */
  async function formatContestCSVData() {
    stateExportData.setLoadingMessage("Formatting contest data, one moment...");
    stateExportData.setIsLoading(true);
    stateExportData.setIsSuccess(false);
    stateExportData.setCsv(null);
    stateExportData.setError(null, false);
    const contestAddress = asPath.split("/")[3]
    const chainName = asPath.split("/")[2]

    const propArrayToReturn = [];
    const tenthPercentile = Math.ceil(listProposalsIds.length / 10);
    try {
      for (let i = 0; i < Math.min(MAX_PROPOSALS_EXPORTING, listProposalsIds.length); i++) {
        propArrayToReturn.push(formatProposal(i));

        if (i % tenthPercentile == 0) {
          stateExportData.setLoadingMessage(`Loading ${i} of ${listProposalsIds.length} entries...`);
        }

        // Every PROPOSALS_PER_ASYNC_BATCH proposals in a contest, wait for all requests to return before sending out more
        // Motivation: to prevent rate-limiting by RPC providers 
        if (i % PROPOSALS_PER_ASYNC_BATCH == 0) {
          await Promise.all(propArrayToReturn);
        }

      }

      const returned = await Promise.all(propArrayToReturn);
      //@ts-ignore
      const reducedPropArray = returned.reduce((accumulator, value) => accumulator.concat(value), []); // Reduce array of arrays of resolved voter dict Promises to a flat array

      stateExportData.setLoadingMessage(`Loaded ${listProposalsIds.length} out of ${listProposalsIds.length} entries!`);
      stateExportData.setCsv(reducedPropArray);
      
      // Store the loaded data to IPFS via web3storage and then load the reference id into Supabase
      //@ts-ignore
      if (process.env.NEXT_PUBLIC_SUPABASE_URL !== '' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN && process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN !== "") {
        if(queryContestResults.data?.length === 0) {
          const formatted = objectToCsv(propArrayToReturn)
          const csv = new File([formatted], `result_contest_${contestAddress}_${chainName}.csv`, { type: 'text/csv' });
    
          const config = await import('@config/supabase')
          const supabase = config.supabase
          const client = makeStorageClient()
          const cid = await client.put([csv])
          stateExportData.setCid(cid)

          await supabase.from("results").insert([
            {
              contest_address: contestAddress,
              contest_network_name: chainName,
              cid
            }
          ])
        }
      }

      stateExportData.setIsSuccess(true);
      stateExportData.setIsLoading(false);
    } catch (e) {
      console.error(e);
      stateExportData.setIsLoading(false);
      //@ts-ignore
      stateExportData.setError(e?.message ?? e, true);
    }
  }

  useEffect(() => {
    stateExportData.resetState();
  }, []);

  return {
    stateExportData,
    formatContestCSVData,
    queryContestResults,
  };
}
