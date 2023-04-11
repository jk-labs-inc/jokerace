import LegacyDeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.1.first.sol/RewardsModule.json";
import NoTiesFoundContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.2.noTiesFound.sol/RewardsModule.json";
import DeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";

import { chains } from "@config/wagmi";
import { getProvider } from "@wagmi/core";
import { utils } from "ethers";

export async function getRewardsModuleContractVersion(address: string, chainName: string) {
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const provider = await getProvider({ chainId: chainId });

  // TODO: Add logic "if version call comes back with 1 or the method doesn't exist, then use 2.1, else, use the relevant version"

  // If none of the cases are found (this shouldn't happen if we have been correctly versioning when we ship smart cntract code),
  // then just use the latest bytecode and ABI.
  return DeployedRewardsModuleContract.abi;
}

export default getRewardsModuleContractVersion;
