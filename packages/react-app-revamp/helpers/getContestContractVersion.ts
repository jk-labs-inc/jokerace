import LegacyDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.1.pre-prompt.sol/Contest.json";
import PromptDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.2.prompt.sol/Contest.json";
import AllProposalTotalVotesDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.3.allProposalTotalVotes.sol/Contest.json";
import ProposalVotesDownvotesContract from "@contracts/bytecodeAndAbi/Contest.2.4.proposalVotesDownvotes.sol/Contest.json";
import SubmissionTokenGatingContract from "@contracts/bytecodeAndAbi/Contest.2.5.submissionTokenGating.sol/Contest.json";
import RewardsContract from "@contracts/bytecodeAndAbi/Contest.2.6.rewards.sol/Contest.json";
import NumberedVersioning from "@contracts/bytecodeAndAbi/Contest.2.8.numberedVersioning.sol/Contest.json";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";

import { chains } from "@config/wagmi";
import { getProvider } from "@wagmi/core";
import { utils } from "ethers";

export async function getContestContractVersion(address: string, chainName: string) {

  // TODO: Add logic "check version and if 2.8, use NumberedVersioning"
  

  // The below is here to catch legacy contract versions that aren't versioned with numbers and whose version function equals 1.

  // TODO: Add logic "If version is 1, then check the below"
  // if (version == 1) {
    const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
    const provider = getProvider({ chainId: chainId });
    const bytecode = await provider.getCode(address);
    if (bytecode.length <= 2) return null;
    if (!bytecode.includes(utils.id("prompt()").slice(2, 10))) {
      return LegacyDeployedContestContract.abi;
    } else if (!bytecode.includes(utils.id("allProposalTotalVotes()").slice(2, 10))) {
      return PromptDeployedContestContract.abi;
    } else if (!bytecode.includes(utils.id("downvotingAllowed()").slice(2, 10))) {
      return AllProposalTotalVotesDeployedContestContract.abi;
    } else if (!bytecode.includes(utils.id("submissionGatingByVotingToken()").slice(2, 10))) {
      return ProposalVotesDownvotesContract.abi;
    } else if (!bytecode.includes(utils.id("officialRewardsModule()").slice(2, 10))) {
      return SubmissionTokenGatingContract.abi;
    } else if (bytecode.includes(utils.id("officialRewardsModule()").slice(2, 10))) {
      return SubmissionTokenGatingContract.abi;
    } else {
      // If the version function returns 1 and it doesn't fulfill the above checks, then it is either 2.6 or 2.7.
      // And because we have no really feasible way of differintating and also because the function calls are the same, we'll go with 2.6 in this case.
      return RewardsContract.abi;
    }
  // }

  // If the version isn't 1 and also isn't any that we have noted (this should not happen if we are versioning smart contract code releases correctly),
  // then fall back to the latest version of bytecode and ABI.
  return DeployedContestContract.abi;

}

export default getContestContractVersion;
