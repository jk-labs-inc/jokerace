import LegacyDeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.1.first.sol/RewardsModule.json";
import NumberedVersioningRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.3.numberedVersioning.sol/RewardsModule.json";
import GateSubmissionsOpenRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.4.gateSubmissionsOpen.sol/RewardsModule.json";
import BetterRewardsNotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.5.betterRewardsNotes.sol/RewardsModule.json";
import MerkleVotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.1.merkleVotes.sol/RewardsModule.json";
import TotalVotesCastRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.2.totalVotesCast.sol/RewardsModule.json";
import SetCompilerRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.3.setCompilerTo8Dot19.sol/RewardsModule.json";
import AddIsDeletedRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.4.addIsDeleted.sol/RewardsModule.json";
import DeployedRewardsContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { ethers } from "ethers";
import { getEthersProvider } from "./ethers";

export async function getRewardsModuleContractVersion(address: string, chainId: number) {
  const provider = getEthersProvider({ chainId });
  const contract = new ethers.Contract(address, NumberedVersioningRewards.abi, provider);

  try {
    const version: string = await contract.version();

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
    } else {
      return DeployedRewardsContract.abi;
    }
  } catch (error) {
    // If the version method does not exist, use the legacy ABI
    return LegacyDeployedRewardsModuleContract.abi;
  }
}

export default getRewardsModuleContractVersion;
