import InitialVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.5.voterRewards.sol/VoterRewardsModule.json";
import SetPeriodLimitsVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.6.setPeriodLimits.sol/VoterRewardsModule.json";
import VotingPriceCurvesVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.7.votingPriceCurves.sol/VoterRewardsModule.json";
import AddModuleTrackingVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.8.addModuleTracking.sol/VoterRewardsModule.json";
import CalcCorrectMinuteVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.9.calcCorrectMinute.sol/VoterRewardsModule.json";
import OnlyDeleteInEntryVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.10.onlyDeleteInEntry.sol/VoterRewardsModule.json";
import AntiRugVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.11.antiRug.sol/VoterRewardsModule.json";
import CorrectDelayVarVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.12.correctDelayVar.sol/VoterRewardsModule.json";
import RankLimitCheckVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.13.rankLimitCheck.sol/VoterRewardsModule.json";
import RmEntryRewardsVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.14.rmEntryRewards.sol/VoterRewardsModule.json";
import VoteAndEarnOnlyVoterRewards from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.5.15.voteAndEarnOnly.sol/VoterRewardsModule.json";
import DeployedVoterRewardsContract from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.sol/VoterRewardsModule.json";
import { createPublicClient, getContract, http } from "viem";
import { getChainFromId } from "./getChainFromId";
import { executeWithTimeout, MAX_TIME_TO_WAIT_FOR_RPC } from "./timeout";

export async function getVoterRewardsModuleContractVersion(address: string, chainId: number) {
  const chain = getChainFromId(chainId);
  const client = createPublicClient({
    chain: chain,
    transport: http(chain?.rpcUrls.default.http[0] ?? ""),
  });

  const contract = getContract({
    address: address as `0x${string}`,
    client,
    abi: InitialVoterRewards.abi,
  });

  try {
    const version = (await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.read.version())) as string;

    if (version === "5.15") {
      return VoteAndEarnOnlyVoterRewards.abi;
    } else if (version === "5.14") {
      return RmEntryRewardsVoterRewards.abi;
    } else if (version === "5.13") {
      return RankLimitCheckVoterRewards.abi;
    } else if (version === "5.12") {
      return CorrectDelayVarVoterRewards.abi;
    } else if (version === "5.11") {
      return AntiRugVoterRewards.abi;
    } else if (version === "5.10") {
      return OnlyDeleteInEntryVoterRewards.abi;
    } else if (version === "5.9") {
      return CalcCorrectMinuteVoterRewards.abi;
    } else if (version === "5.8") {
      return AddModuleTrackingVoterRewards.abi;
    } else if (version === "5.7") {
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
