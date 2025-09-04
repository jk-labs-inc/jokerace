/**
 * Creates a map of function names to their result values from contract calls (before we were relying on index and now we are relying on function name, check later if we need to change it back)
 */
export function createResultGetter(contracts: any[], results: any[]) {
  const functionNameToIndex = new Map<string, number>();
  contracts.forEach((contract, index) => {
    functionNameToIndex.set(contract.functionName, index);
  });

  const getResultByName = (functionName: string): any => {
    const index = functionNameToIndex.get(functionName);
    if (index !== undefined && results[index]) {
      return results[index].result;
    }
    return undefined;
  };

  return getResultByName;
}
