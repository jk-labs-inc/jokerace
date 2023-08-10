import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type ProofType = "submission" | "vote";

type ProofResult = string[];

const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useGenerateProof() {
  const { asPath } = useRouter();
  const account = useAccount();
  const [url] = useState(asPath.split("/"));
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id,
  );
  const contestChainName = url[2];
  const contestAddress = url[3];

  async function getContractConfig() {
    const { abi } = await getContestContractVersion(contestAddress, chainId);

    return {
      address: contestAddress as `0x${string}`,
      abi: abi,
      chainId: chainId,
    };
  }

  async function generateProofs(
    address: string,
    numVotes: string,
    type: "submission" | "voting",
  ): Promise<ProofResult> {
    const selectType = type === "submission" ? "submissionMerkleTree" : "votingMerkleTree";
    try {
      const { data } = await supabase
        .from("contests_v3")
        .select(selectType)
        .eq("address", contestAddress)
        .eq("network_name", contestChainName);

      if (data && data.length > 0) {
        const merkleTreeData = data[0];

        const tree = merkleTreeData[selectType];

        const participants = type === "submission" ? tree.submitters : tree.voters;

        const generateTreeWorker = new Worker(new URL("/workers/generateProof", import.meta.url));

        return new Promise<string[]>((resolve, reject) => {
          generateTreeWorker.onmessage = event => {
            const { proofs } = event.data;

            resolve(proofs);
            generateTreeWorker.terminate();
          };

          generateTreeWorker.onerror = error => {
            reject(new Error(`Worker error: ${error.message}`));
          };

          generateTreeWorker.postMessage({
            address: address,
            numVotes: numVotes,
            data: participants,
          });
        });
      } else {
        return Promise.resolve([]);
      }
    } catch (error) {
      console.error(`Error in generate${type.charAt(0).toUpperCase() + type.slice(1)}Proofs:`, error);
      return Promise.reject(error);
    }
  }

  async function getProofs(address: string, proofType: ProofType, numVotes: string): Promise<ProofResult> {
    const isVerified = await checkIfUserIsVerified(address, proofType);

    if (isVerified) return [];

    switch (proofType) {
      case "submission":
        const contractConfig = await getContractConfig();

        //@ts-ignore
        const submissionMerkleRoot = (await readContract({
          ...contractConfig,
          functionName: "submissionMerkleRoot",
        })) as string;

        if (submissionMerkleRoot === EMPTY_ROOT) {
          return [];
        } else {
          const submissionProofs = await generateProofs(address, numVotes, "submission");
          return submissionProofs;
        }
      case "vote":
        const votingProofs = await generateProofs(address, numVotes, "voting");

        return votingProofs;
    }
  }

  async function checkIfUserIsVerified(address: string, proofType: ProofType) {
    const contractConfig = await getContractConfig();

    let verified = false;

    switch (proofType) {
      case "submission":
        //@ts-ignore
        verified = (await readContract({
          ...contractConfig,
          functionName: "addressSubmitterVerified",
          args: [address as `0x${string}`],
        })) as boolean;
        break;
      case "vote":
        //@ts-ignore
        verified = (await readContract({
          ...contractConfig,
          functionName: "addressTotalVotesVerified",
          args: [address as `0x${string}`],
        })) as boolean;
        break;
      default:
        break;
    }

    return verified;
  }

  useEffect(() => {
    if (account?.connector) {
      account?.connector.on("change", data => {
        if (!data.chain) return;

        setChainId(data.chain.id);
      });
    }
  }, [account?.connector]);

  return {
    getProofs,
  };
}
