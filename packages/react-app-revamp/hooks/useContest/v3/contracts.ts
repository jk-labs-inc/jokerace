export function getV3Contracts(contractConfig: any) {
  const contractFunctionNames = [
    "name",
    "creator",
    "numAllowedProposalSubmissions",
    "maxProposalCount",
    "contestStart",
    "contestDeadline",
    "voteStart",
    "state",
    "prompt",
    "downvotingAllowed",
    "submissionMerkleRoot",
    "votingMerkleRoot",
  ];

  const contracts = contractFunctionNames.map(functionName => ({
    ...contractConfig,
    functionName,
  }));

  return contracts;
}
