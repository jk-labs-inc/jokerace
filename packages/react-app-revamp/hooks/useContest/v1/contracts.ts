export function getV1Contracts(contractConfig: any) {
  const contractFunctionNames = [
    "name",
    "creator",
    "numAllowedProposalSubmissions",
    "maxProposalCount",
    "token",
    "contestStart",
    "contestDeadline",
    "voteStart",
    "state",
    "proposalThreshold",
  ];

  const contracts = contractFunctionNames.map(functionName => ({
    ...contractConfig,
    functionName,
  }));

  if (contractConfig.abi?.some(({ name }: any) => name === "prompt")) {
    contracts.push({
      ...contractConfig,
      functionName: "prompt",
    });
  }
  if (contractConfig.abi?.some(({ name }: any) => name === "downvotingAllowed")) {
    contracts.push({
      ...contractConfig,
      functionName: "downvotingAllowed",
    });
  }
  if (contractConfig.abi?.some(({ name }: any) => name === "submissionGatingByVotingToken")) {
    contracts.push(
      {
        ...contractConfig,
        functionName: "submissionGatingByVotingToken",
      },
      {
        ...contractConfig,
        functionName: "submissionToken",
      },
    );
  }

  return contracts;
}
