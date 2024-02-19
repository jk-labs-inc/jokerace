import { generateMerkleTree } from "lib/merkletree/generateMerkleTree";

export interface AllowListEntry {
  decimals: number;
  allowList: Record<string, number>;
}

export interface MerkleTreeGenerationPayload {
  allowLists: AllowListEntry[];
}

export interface MerkleTreeResult {
  merkleRoot: string;
  recipients: Record<string, any>;
  allowList: Record<string, number>;
}

self.onmessage = (event: MessageEvent<MerkleTreeGenerationPayload>) => {
  const { allowLists } = event.data;

  const results: MerkleTreeResult[] = allowLists.map(({ decimals, allowList }) => {
    const { merkleRoot, recipients } = generateMerkleTree(decimals, allowList);
    return { merkleRoot, recipients, allowList };
  });

  postMessage(results);
};
