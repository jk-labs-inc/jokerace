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
import CantVoteOnDeletedContract from "@contracts/bytecodeAndAbi/Contest.3.10.cantVoteOnDeletedProps.sol/Contest.json";
import AuditMinorFixesContract from "@contracts/bytecodeAndAbi/Contest.3.11.auditMinorFixes.sol/Contest.json";
import AuditInfoAndOptimizationsContract from "@contracts/bytecodeAndAbi/Contest.3.12.auditInfoAndOptimizations.sol/Contest.json";
import CleanUpContractDocsContract from "@contracts/bytecodeAndAbi/Contest.3.13.cleanUpContractDocs.sol/Contest.json";
import TrackProposalAuthorsContract from "@contracts/bytecodeAndAbi/Contest.3.14.trackProposalAuthors.sol/Contest.json";
import TrackVotersContract from "@contracts/bytecodeAndAbi/Contest.3.15.trackVoters.sol/Contest.json";
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
import { executeWithTimeout, MAX_TIME_TO_WAIT_FOR_RPC } from "./timeout";

export async function getContestContractVersion(address: string, chainId: number) {
  try {
    const provider = getEthersProvider({ chainId });
    const contract = new ethers.Contract(address, NumberedVersioningContract.abi, provider);

    // Here we check if all RPC calls are successful, otherwise we throw an error and return empty ABI
    const version: string = await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.version());

    const defaultReturn = { abi: null, version: "unknown" };

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
    } else if (version === "3.10") {
      return { abi: CantVoteOnDeletedContract.abi, version };
    } else if (version === "3.11") {
      return { abi: AuditMinorFixesContract.abi, version };
    } else if (version === "3.12") {
      return { abi: AuditInfoAndOptimizationsContract.abi, version };
    } else if (version === "3.13") {
      return { abi: CleanUpContractDocsContract.abi, version };
    } else if (version === "3.14") {
      return { abi: TrackProposalAuthorsContract.abi, version };
    } else if (version === "3.15") {
      return { abi: TrackVotersContract.abi, version };
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
  } catch (error: unknown) {
    console.error(`Error while fetching the contract version for address ${address} on chainId ${chainId}:`, error);
    return { abi: null, version: "error" };
  }
}

export default getContestContractVersion;
