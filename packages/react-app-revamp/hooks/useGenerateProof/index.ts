import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { generateProof as generateSubmissionProof } from "lib/merkletree/generateSubmissionsTree";
import { generateProof as generateVotingProof } from "lib/merkletree/generateVotersTree";
import MerkleTree from "merkletreejs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type ProofType = "submission" | "vote";

export function useGenerateProof(merkleTree: MerkleTree, address: string, proofType: ProofType, numVotes?: string) {
  const { asPath } = useRouter();
  const account = useAccount();
  const [url] = useState(asPath.split("/"));

  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id,
  );
  const chainName = url[2];
  const contestAddress = url[3];

  function generateProof(proofType: ProofType) {
    switch (proofType) {
      case "submission":
        const submissionProof = generateSubmissionProof(merkleTree, address);
        return submissionProof;
      case "vote":
        const votingProof = generateVotingProof(merkleTree, address, numVotes ?? "");
        return votingProof;
      default:
        break;
    }
  }

  async function checkIfProofIsValid() {
    const proof = generateProof(proofType);

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

    if (verified) {
      return true;
    } else {
      return proof;
    }
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
    checkIfProofIsValid,
  };
}
