import LegacyDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.1.pre-prompt.sol/Contest.json";
import BetterRewardsNotesContract from "@contracts/bytecodeAndAbi/Contest.2.10.betterRewardsNotes.sol/Contest.json";
import PromptDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.2.prompt.sol/Contest.json";
import AllProposalTotalVotesDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.2.3.allProposalTotalVotes.sol/Contest.json";
import ProposalVotesDownvotesContract from "@contracts/bytecodeAndAbi/Contest.2.4.proposalVotesDownvotes.sol/Contest.json";
import SubmissionTokenGatingContract from "@contracts/bytecodeAndAbi/Contest.2.5.submissionTokenGating.sol/Contest.json";
import RewardsContract from "@contracts/bytecodeAndAbi/Contest.2.6.rewards.sol/Contest.json";
import NumberedVersioningContract from "@contracts/bytecodeAndAbi/Contest.2.8.numberedVersioning.sol/Contest.json";
import GateSubmissionsOpenContract from "@contracts/bytecodeAndAbi/Contest.2.9.gateSubmissionsOpen.sol/Contest.json";
import MerkleVotesContract from "@contracts/bytecodeAndAbi/Contest.3.1.merkleVotes.sol/Contest.json";
import TotalVotesCastContract from "@contracts/bytecodeAndAbi/Contest.3.2.totalVotesCast.sol/Contest.json";
import SetCompilerContract from "@contracts/bytecodeAndAbi/Contest.3.3.setCompilerTo8Dot19.sol/Contest.json";
import AddIsDeletedContract from "@contracts/bytecodeAndAbi/Contest.3.4.addIsDeleted.sol/Contest.json";
import DeletedDontHitLimitContract from "@contracts/bytecodeAndAbi/Contest.3.5.deletedDontHitLimit.sol/Contest.json";
import BringBackDeletedIdsContract from "@contracts/bytecodeAndAbi/Contest.3.6.bringBackDeletedIds.sol/Contest.json";
import ArrayOfDeletedIdsContract from "@contracts/bytecodeAndAbi/Contest.3.7.makeArrayOfDeletedIds.sol/Contest.json";
import DeletedIdAccessorContract from "@contracts/bytecodeAndAbi/Contest.3.8.makeDeletedIdAccessor.sol/Contest.json";
import PrivateDeletedIdsContract from "@contracts/bytecodeAndAbi/Contest.3.9.privateDeletedIds.sol/Contest.json";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { ethers, utils } from "ethers";
import { getEthersProvider } from "./ethers";

export async function getContestContractVersion(address: string, chainId: number) {
  const provider = getEthersProvider({ chainId });
  const contract = new ethers.Contract(address, NumberedVersioningContract.abi, provider);

  const version: string = await contract.version();

  const defaultReturn = { abi: [], version: "unknown" };

  if (version === "2.8") {
    return { abi: NumberedVersioningContract.abi, version };
  } else if (version === "2.9") {
    return { abi: GateSubmissionsOpenContract.abi, version };
  } else if (version === "2.10") {
    return { abi: BetterRewardsNotesContract.abi, version };
  } else if (version === "3.1") {
    return { abi: MerkleVotesContract.abi, version };
  } else if (version === "3.2") {
    return { abi: TotalVotesCastContract.abi, version };
  } else if (version === "3.3") {
    return { abi: SetCompilerContract.abi, version };
  } else if (version === "3.4") {
    return { abi: AddIsDeletedContract.abi, version };
  } else if (version === "3.5") {
    return { abi: DeletedDontHitLimitContract.abi, version };
  } else if (version === "3.6") {
    return { abi: BringBackDeletedIdsContract.abi, version };
  } else if (version === "3.7") {
    return { abi: ArrayOfDeletedIdsContract.abi, version };
  } else if (version === "3.8") {
    return { abi: DeletedIdAccessorContract.abi, version };
  } else if (version === "3.9") {
    return { abi: PrivateDeletedIdsContract.abi, version };
  }

  if (version === "1") {
    const bytecode = await provider.getCode(address);
    if (bytecode.length <= 2) return defaultReturn;
    if (!bytecode.includes(utils.id("prompt()").slice(2, 10))) {
      return { abi: LegacyDeployedContestContract.abi, version };
    } else if (!bytecode.includes(utils.id("allProposalTotalVotes()").slice(2, 10))) {
      return { abi: PromptDeployedContestContract.abi, version };
    } else if (!bytecode.includes(utils.id("downvotingAllowed()").slice(2, 10))) {
      return { abi: AllProposalTotalVotesDeployedContestContract.abi, version };
    } else if (!bytecode.includes(utils.id("submissionGatingByVotingToken()").slice(2, 10))) {
      return { abi: ProposalVotesDownvotesContract.abi, version };
    } else if (!bytecode.includes(utils.id("officialRewardsModule()").slice(2, 10))) {
      return { abi: SubmissionTokenGatingContract.abi, version };
    } else {
      return { abi: RewardsContract.abi, version };
    }
  }

  return { abi: DeployedContestContract.abi, version };
}

export default getContestContractVersion;
