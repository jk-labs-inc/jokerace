export function getContracts(contractConfig: any, version: number) {
  const commonFunctionNames = [
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
  ];

  const v4FunctionNames = ["costToPropose", "percentageToCreator"];

  const contractFunctionNames = version >= 4 ? [...commonFunctionNames, ...v4FunctionNames] : commonFunctionNames;

  const contracts = contractFunctionNames.map(functionName => ({
    ...contractConfig,
    functionName,
  }));

  return contracts;
}
