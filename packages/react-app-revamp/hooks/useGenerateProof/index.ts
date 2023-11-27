import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { loadFileFromBucket } from "lib/buckets";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type ProofType = "submission" | "vote";

type ProofResult = {
  isVerified: boolean;
  proofs: any[];
};

type GenerateProofResult = any[];

const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useGenerateProof() {
  const { asPath } = useRouter();
  const { chainName, address: contestAddress } = extractPathSegments(asPath);
  const account = useAccount();
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id,
  );

  async function getContractConfig() {
    const { abi } = await getContestContractVersion(contestAddress, chainId);

    return {
      address: contestAddress as `0x${string}`,
      abi: abi,
      chainId: chainId,
    };
  }

  async function generateProofs(address: string, numVotes: string, merkleRoot: string): Promise<GenerateProofResult> {
    try {
      const recipients = await fetchFileFromBucket(merkleRoot);

      if (recipients) {
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
            data: recipients,
          });
        });
      } else {
        return Promise.resolve([]);
      }
    } catch (error) {
      console.error(`Error in generate proof`);
      return Promise.reject(error);
    }
  }

  async function getProofs(address: string, proofType: ProofType, numVotes: string): Promise<ProofResult> {
    const isVerified = await checkIfUserIsVerified(address, proofType);

    const proofs = isVerified ? [] : await getProofsBasedOnType(proofType, address, numVotes);

    return {
      isVerified,
      proofs,
    };
  }

  async function getProofsBasedOnType(proofType: ProofType, address: string, numVotes: string): Promise<any[]> {
    const contractConfig = await getContractConfig();

    switch (proofType) {
      case "submission":
        //@ts-ignore
        const submissionMerkleRoot = (await readContract({
          ...contractConfig,
          functionName: "submissionMerkleRoot",
        })) as string;

        if (submissionMerkleRoot === EMPTY_ROOT) {
          return [];
        } else {
          return await generateProofs(address, numVotes, submissionMerkleRoot);
        }
      case "vote":
        //@ts-ignore
        const votingMerkleRoot = (await readContract({
          ...contractConfig,
          functionName: "votingMerkleRoot",
        })) as string;
        return await generateProofs(address, numVotes, votingMerkleRoot);
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

  async function fetchFileFromBucket(merkleRoot: string) {
    const recipients = await loadFileFromBucket({ fileId: merkleRoot });

    if (!recipients) return [];

    return recipients;
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
