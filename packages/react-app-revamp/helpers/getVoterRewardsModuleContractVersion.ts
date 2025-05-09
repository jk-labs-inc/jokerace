import { config } from "@config/wagmi";
import VoterRewardsVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.5.voterRewards.sol/VoterRewardsModule.json";
import DeployedVoterRewardsContract from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.sol/VoterRewardsModule.json";
import { ethers } from "ethers";
import { getEthersProvider } from "./ethers";
import { executeWithTimeout, MAX_TIME_TO_WAIT_FOR_RPC } from "./timeout";

export async function getVoterRewardsModuleContractVersion(address: string, chainId: number) {
  const provider = getEthersProvider(config, { chainId });
  const contract = new ethers.Contract(address, VoterRewardsVoterRewards.abi, provider);

  try {
    const version: string = await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.version());
    if (version === "5.5") {
      return VoterRewardsVoterRewards.abi;
    } else {
      return DeployedVoterRewardsContract.abi;
    }
  } catch (error) {
    // If the version method does not exist or is failing, use the first version 
    return VoterRewardsVoterRewards.abi;
  }
}

export default getVoterRewardsModuleContractVersion;
