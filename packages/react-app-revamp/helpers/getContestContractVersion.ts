import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import LegacyDeployedContestContract from "@contracts/bytecodeAndAbi/Contest.legacy.sol/Contest.json";
import { getProvider } from "@wagmi/core";
import { utils } from "ethers";

export async function getContestContractVersion(address: string) {
  const provider = await getProvider();
  const bytecode = await provider.getCode(address);

  if (bytecode.length <= 2) return null;
  if (bytecode.includes(utils.id("prompt()").slice(2, 10))) {
    return DeployedContestContract.abi;
  }

  return LegacyDeployedContestContract.abi;
}

export default getContestContractVersion;
