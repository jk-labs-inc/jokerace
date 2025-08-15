import { config } from "@config/wagmi";
import InitialVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.5.voterRewards.sol/VoterRewardsModule.json";
import SetPeriodLimitsVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.6.setPeriodLimits.sol/VoterRewardsModule.json";
import VotingPriceCurvesVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.7.votingPriceCurves.sol/VoterRewardsModule.json";
import AddModuleTrackingVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.8.addModuleTracking.sol/VoterRewardsModule.json";
import CalcCorrectMinuteVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.9.calcCorrectMinute.sol/VoterRewardsModule.json";
import OnlyDeleteInEntryVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.10.onlyDeleteInEntry.sol/VoterRewardsModule.json";
import AntiRugVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.11.antiRug.sol/VoterRewardsModule.json";
import DeployedVoterRewardsContract from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.sol/VoterRewardsModule.json";
import { ethers } from "ethers";
import { getEthersProvider } from "./ethers";
import { executeWithTimeout, MAX_TIME_TO_WAIT_FOR_RPC } from "./timeout";

export async function getVoterRewardsModuleContractVersion(address: string, chainId: number) {
  const provider = getEthersProvider(config, { chainId });
  const contract = new ethers.Contract(address, InitialVoterRewards.abi, provider);

  try {
    const version: string = await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.version());
    if (version === "5.11") {
      return AntiRugVoterRewards.abi;
    } else if (version === "5.10") {
      return OnlyDeleteInEntryVoterRewards.abi;
    } else if (version === "5.9") {
      return CalcCorrectMinuteVoterRewards.abi;
    } else if (version === "5.8") {
      return AddModuleTrackingVoterRewards.abi;
    } else  if (version === "5.7") {
      return VotingPriceCurvesVoterRewards.abi;
    } else if (version === "5.6") {
      return SetPeriodLimitsVoterRewards.abi;
    } else if (version === "5.5") {
      return InitialVoterRewards.abi;
    } else {
      return DeployedVoterRewardsContract.abi;
    }
  } catch (error) {
    // If the version method does not exist or is failing, use the first version
    return InitialVoterRewards.abi;
  }
}

export default getVoterRewardsModuleContractVersion;
