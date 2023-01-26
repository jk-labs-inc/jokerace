import DeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { getProvider } from "@wagmi/core";
import { chains } from "@config/wagmi";

export async function getRewardsModuleContractVersion(address: string, chainName: string) {
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const provider = await getProvider({ chainId: chainId });
  const bytecode = await provider.getCode(address);

  if (bytecode.length <= 2) return null;

  return DeployedRewardsModuleContract.abi;
}

export default getRewardsModuleContractVersion;
