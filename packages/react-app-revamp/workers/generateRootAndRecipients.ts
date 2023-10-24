import { generateMerkleTree } from "lib/merkletree/generateMerkleTree";

export interface MerkleTreeGenerationPayload {
  decimals: number;
  allowList: Record<string, number>;
}

self.onmessage = (event: MessageEvent<MerkleTreeGenerationPayload>) => {
  const { allowList, decimals } = event.data;

  const { merkleRoot, recipients } = generateMerkleTree(decimals, allowList);

  postMessage({ merkleRoot, recipients, allowList });
};
