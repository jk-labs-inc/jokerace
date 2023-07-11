import { chains } from "@config/wagmi";
import LegacyDeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.1.first.sol/RewardsModule.json";
import NumberedVersioningRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.3.numberedVersioning.sol/RewardsModule.json";
import GateSubmissionsOpenRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.4.gateSubmissionsOpen.sol/RewardsModule.json";
import BetterRewardsNotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.5.betterRewardsNotes.sol/RewardsModule.json";
import MerkleVotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.1.merkleVotes.sol/RewardsModule.json";
import TotalVotesCastRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.2.totalVotesCast.sol/RewardsModule.json";
import { getProvider } from "@wagmi/core";
import { ethers } from "ethers";

export async function getRewardsModuleContractVersion(address: string, chainName: string) {
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const provider = await getProvider({ chainId: chainId });

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
    } else {
      return LegacyDeployedRewardsModuleContract.abi;
    }
  } catch (error) {
    // If the version method does not exist, use the legacy ABI
    return LegacyDeployedRewardsModuleContract.abi;
  }
}

export default getRewardsModuleContractVersion;
