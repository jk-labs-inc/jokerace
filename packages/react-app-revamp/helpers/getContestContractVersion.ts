import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import LegacyDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.legacy.1.pre-prompt.sol/Contest.json";
import PromptDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.legacy.2.prompt.sol/Contest.json";
import AllProposalTotalVotesDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.legacy.3.allProposalTotalVotes.sol/Contest.json";
import { getProvider } from "@wagmi/core";
import { utils } from "ethers";

export async function getContestContractVersion(address: string) {
  const provider = await getProvider();
  const bytecode = await provider.getCode(address);

  if (bytecode?.length <= 2) return null;
  if (!bytecode?.includes(utils.id("prompt()").slice(2, 10))) {
    return LegacyDeployedContestContract.abi;
  } else if (!bytecode?.includes(utils.id("allProposalTotalVotes()").slice(2, 10))) {
    return PromptDeployedContestContract.abi;
  } else if (!bytecode?.includes(utils.id("downvotingAllowed()").slice(2, 10))) {
    return AllProposalTotalVotesDeployedContestContract.abi;
  }
  
  return DeployedContestContract.abi;
}

export default getContestContractVersion;
