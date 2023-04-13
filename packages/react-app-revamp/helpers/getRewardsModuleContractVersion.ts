import LegacyDeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.1.first.sol/RewardsModule.json";
import NoTiesFoundContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.2.noTiesFound.sol/RewardsModule.json";
import DeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { chains } from "@config/wagmi";
import { getProvider } from "@wagmi/core";
import { ethers } from "ethers";

export async function getRewardsModuleContractVersion(address: string, chainName: string) {
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const provider = await getProvider({ chainId: chainId });
  const contract = new ethers.Contract(address, DeployedRewardsModuleContract.abi, provider);

  try {
    const version = await contract.version();

    if (version === 1) {
      return LegacyDeployedRewardsModuleContract.abi;
    } else {
      return NoTiesFoundContract.abi;
    }
  } catch (error) {
    // If the version method does not exist, use the legacy ABI
    return LegacyDeployedRewardsModuleContract.abi;
  }
}

export default getRewardsModuleContractVersion;
