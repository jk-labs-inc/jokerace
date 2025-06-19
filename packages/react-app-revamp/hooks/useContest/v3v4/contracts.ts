import { compareVersions } from "compare-versions";


enum VERSIONS {
  V4_0 = "4.0",
  V4_2 = "4.2",
  V4_23 = "4.23",
  V4_25 = "4.25",
  V4_29 = "4.29",
  V5_7 = "5.7",
}

export function getContracts(contractConfig: any, version: string) {
  const commonFunctionNames = [
    "name",
    "creator",
    "numAllowedProposalSubmissions",
    "maxProposalCount",
    "contestStart",
    "contestDeadline",
    "voteStart",
    "prompt",
    "state",
  ];

  const v4FunctionNames = ["percentageToCreator", "costToPropose"];

  const v4_2FunctionNames = ["sortingEnabled"];

  const v5_7FunctionNames = ["priceCurveType, multiple"];

  let contractFunctionNames = [...commonFunctionNames];

  if (compareVersions(version, VERSIONS.V4_0) >= 0) {
    contractFunctionNames = [...contractFunctionNames, ...v4FunctionNames];
  }
  if (compareVersions(version, VERSIONS.V4_2) >= 0) {
    contractFunctionNames = [...contractFunctionNames, ...v4_2FunctionNames];
  }

  if (compareVersions(version, VERSIONS.V4_23) >= 0) {
    contractFunctionNames = [...contractFunctionNames, "costToVote"];
  }

  if (compareVersions(version, VERSIONS.V4_25) >= 0) {
    contractFunctionNames = [...contractFunctionNames, "payPerVote"];
  }

  if (compareVersions(version, VERSIONS.V4_29) >= 0) {
    contractFunctionNames = [...contractFunctionNames, "creatorSplitDestination"];
  }

  if (compareVersions(version, VERSIONS.V5_7) >= 0) {
    contractFunctionNames = [...contractFunctionNames, "priceCurve"];
  }

  const contracts = contractFunctionNames.map(functionName => ({
    ...contractConfig,
    functionName,
  }));

  return contracts;
}
