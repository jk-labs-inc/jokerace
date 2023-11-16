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

  const v4_2FunctionNames = ["sortingEnabled"];

  let contractFunctionNames = [...commonFunctionNames];
  if (version >= 4) {
    contractFunctionNames = [...contractFunctionNames, ...v4FunctionNames];
  }
  if (version >= 4.2) {
    contractFunctionNames = [...contractFunctionNames, ...v4_2FunctionNames];
  }

  const contracts = contractFunctionNames.map(functionName => ({
    ...contractConfig,
    functionName,
  }));

  return contracts;
}
