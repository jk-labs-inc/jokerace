import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { generateProof } from "lib/merkletree/generateMerkleTree";
import MerkleTree from "merkletreejs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type ProofType = "submission" | "vote";

export function useGenerateProof() {
  const { asPath } = useRouter();
  const account = useAccount();
  const [url] = useState(asPath.split("/"));

  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id,
  );
  const chainName = url[2];
  const contestAddress = url[3];

  function getProof(merkleTree: MerkleTree, address: string, proofType: ProofType, numVotes?: string) {
    switch (proofType) {
      case "submission":
        const submissionProof = generateProof(merkleTree, address, "10");
        return submissionProof;
      case "vote":
        const votingProof = generateProof(merkleTree, address, numVotes ?? "");
        return votingProof;
      default:
        return [];
    }
  }

  async function checkIfProofIsVerified(
    merkleTree: MerkleTree,
    address: string,
    proofType: ProofType,
    numVotes?: string,
  ) {
    const proofs = getProof(merkleTree, address, proofType, numVotes);

    const { abi } = await getContestContractVersion(contestAddress, chainName);

    const contractConfig = {
      addressOrName: contestAddress,
      contractInterface: abi,
      chainId: chainId,
    };

    let verified = false;
    switch (proofType) {
      case "submission":
        verified = await readContract({
          ...contractConfig,
          functionName: "addressSubmitterVerified",
          args: [address],
        });

        break;
      case "vote":
        verified = await readContract({
          ...contractConfig,
          functionName: "addressTotalVotesVerified",
          args: [address],
        });
        break;
      default:
        break;
    }

    return {
      verified,
      proofs,
    };
  }

  useEffect(() => {
    if (account?.connector) {
      account?.connector.on("change", data => {
        //@ts-ignore
        setChainId(data.chain.id);
      });
    }
  }, [account?.connector]);

  return {
    checkIfProofIsVerified,
  };
}
