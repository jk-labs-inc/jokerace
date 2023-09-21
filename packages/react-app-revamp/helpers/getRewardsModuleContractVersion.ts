import LegacyDeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.1.first.sol/RewardsModule.json";
import NumberedVersioningRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.3.numberedVersioning.sol/RewardsModule.json";
import GateSubmissionsOpenRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.4.gateSubmissionsOpen.sol/RewardsModule.json";
import BetterRewardsNotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.5.betterRewardsNotes.sol/RewardsModule.json";
import MerkleVotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.1.merkleVotes.sol/RewardsModule.json";
import CantVoteOnDeletedPropsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.10.cantVoteOnDeletedProps.sol/RewardsModule.json";
import AuditMinorFixesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.11.auditMinorFixes.sol/RewardsModule.json";
import AuditInfoAndOptimizationsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.12.auditInfoAndOptimizations.sol/RewardsModule.json";
import TotalVotesCastRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.2.totalVotesCast.sol/RewardsModule.json";
import SetCompilerRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.3.setCompilerTo8Dot19.sol/RewardsModule.json";
import AddIsDeletedRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.4.addIsDeleted.sol/RewardsModule.json";
import DeletedDontHitLimitRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.5.deletedDontHitLimit.sol/RewardsModule.json";
import BringBackDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.6.bringBackDeletedIds.sol/RewardsModule.json";
import ArrayOfDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.7.makeArrayOfDeletedIds.sol/RewardsModule.json";
import DeletedIdAccessorRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.8.makeDeletedIdAccessor.sol/RewardsModule.json";
import PrivateDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.9.privateDeletedIds.sol/RewardsModule.json";
import DeployedRewardsContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { ethers } from "ethers";
import { getEthersProvider } from "./ethers";
import { executeWithTimeout, MAX_TIME_TO_WAIT_FOR_RPC } from "./timeout";

export async function getRewardsModuleContractVersion(address: string, chainId: number) {
  const provider = getEthersProvider({ chainId });
  const contract = new ethers.Contract(address, NumberedVersioningRewards.abi, provider);

  try {
    const version: string = await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.version());

    if (version === "1") {
      return LegacyDeployedRewardsModuleContract.abi;
    } else if (version === "2.3") {
      return NumberedVersioningRewards.abi;
    } else if (version === "2.4") {
      return GateSubmissionsOpenRewards.abi;
    } else if (version === "2.5") {
      return BetterRewardsNotesRewards.abi;
    } else if (version === "3.1") {
      return MerkleVotesRewards.abi;
    } else if (version === "3.2") {
      return TotalVotesCastRewards.abi;
    } else if (version === "3.3") {
      return SetCompilerRewards.abi;
    } else if (version === "3.4") {
      return AddIsDeletedRewards.abi;
    } else if (version === "3.5") {
      return DeletedDontHitLimitRewards.abi;
    } else if (version === "3.6") {
      return BringBackDeletedIdsRewards.abi;
    } else if (version === "3.7") {
      return ArrayOfDeletedIdsRewards.abi;
    } else if (version === "3.8") {
      return DeletedIdAccessorRewards.abi;
    } else if (version === "3.9") {
      return PrivateDeletedIdsRewards.abi;
    } else if (version === "3.10") {
      return CantVoteOnDeletedPropsRewards.abi;
    } else if (version === "3.11") {
      return AuditMinorFixesRewards.abi;
    } else if (version === "3.12") {
      return AuditInfoAndOptimizationsRewards.abi;
    } else {
      return DeployedRewardsContract.abi;
    }
  } catch (error) {
    // If the version method does not exist, use the legacy ABI
    return LegacyDeployedRewardsModuleContract.abi;
  }
}

export default getRewardsModuleContractVersion;
