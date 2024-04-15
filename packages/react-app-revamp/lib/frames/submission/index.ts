import { serverConfig } from "@config/wagmi/server";
import { readContract, readContracts } from "@wagmi/core";
import { Abi } from "viem";
import { EMPTY_ROOT } from "../utils";

export const targetMetadata = {
  targetAddress: "0x0000000000000000000000000000000000000000",
};

export const safeMetadata = {
  signers: ["0x0000000000000000000000000000000000000000"],
  threshold: 1,
};

export const fetchContestInitialData = async (abi: Abi, chainId: number, address: string) => {
  const contracts = [
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "name",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "creator",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "submissionMerkleRoot",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "contestStart",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "voteStart",
    },
  ];

  const results = (await readContracts(serverConfig, { contracts })) as any;
  const name = results[0].result as string;
  const creator = results[1].result as string;
  const submissionMerkleRoot = results[2].result as string;
  const submissionsOpenDate = new Date(Number(results[3].result) * 1000 + 1000);
  const submissionsClosedDate = new Date(Number(results[4].result) * 1000 + 1000);
  let anyoneCanSubmit = false;

  if (submissionMerkleRoot === EMPTY_ROOT) {
    anyoneCanSubmit = true;
  }

  return {
    name,
    creator,
    anyoneCanSubmit,
    submissionsOpenDate,
    submissionsClosedDate,
  };
};

export const fetchContestSecondaryData = async (abi: Abi, chainId: number, address: string) => {
  const contracts = [
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "name",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "creator",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "prompt",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "costToPropose",
    },
    {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "voteStart",
    },
  ];

  const results = (await readContracts(serverConfig, { contracts })) as any;
  const name = results[0].result as string;
  const creator = results[1].result as string;
  const prompt = results[2].result as string;
  const costToPropose = Number(results[3].result);
  const voteStartDate = new Date(Number(results[4].result) * 1000 + 1000);

  return {
    name,
    creator,
    prompt,
    costToPropose,
    voteStartDate,
  };
};

export const fetchCostToPropose = async (abi: Abi, chainId: number, address: string) => {
  const costToPropose = (await readContract(serverConfig, {
    address: address as `0x${string}`,
    abi,
    chainId,
    functionName: "costToPropose",
  })) as bigint;

  return costToPropose;
};
