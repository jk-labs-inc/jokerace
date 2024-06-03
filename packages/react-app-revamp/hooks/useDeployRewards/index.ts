import { useCreateRewardsStore } from "@components/_pages/Contest/Rewards/components/Create/store";
import { config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { getEthersSigner } from "@helpers/ethers";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { ContractFactory } from "ethers";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export function useDeployRewardsPool() {
  const { chainId } = useAccount();
  const asPath = usePathname();
  const { address: contestAddress } = extractPathSegments(asPath ?? "");
  const setSupportsRewardsModule = useContestStore(state => state.setSupportsRewardsModule);
  const { rewardPoolData, setRewardPoolData } = useCreateRewardsStore(state => state);
  const { handleError } = useError();

  async function deployRewardsPool() {
    setRewardPoolData({
      ...rewardPoolData,
      deploy: {
        ...rewardPoolData.deploy,
        loading: true,
      },
    });

    try {
      const signer = await getEthersSigner(config, { chainId });

      // Deploy Rewards Module
      const factoryCreateRewardsModule = new ContractFactory(
        RewardsModuleContract.abi,
        RewardsModuleContract.bytecode,
        signer,
      );
      const contractRewardsModule = await factoryCreateRewardsModule.deploy(
        rewardPoolData.rankings,
        rewardPoolData.shareAllocations,
        contestAddress,
        false,
      );
      await contractRewardsModule.deployTransaction.wait();

      setRewardPoolData({
        ...rewardPoolData,
        deploy: {
          ...rewardPoolData.deploy,
          success: true,
          loading: false,
        },
      });

      // Attach Rewards Module
      const contractConfig = {
        address: contestAddress as `0x${string}`,
        abi: DeployedContestContract.abi,
      };

      setRewardPoolData({
        ...rewardPoolData,
        attach: {
          ...rewardPoolData.attach,
          loading: true,
        },
      });

      const { request } = await simulateContract(config, {
        ...contractConfig,
        functionName: "setOfficialRewardsModule",
        args: [contractRewardsModule.address],
      });

      const hash = await writeContract(config, {
        ...request,
      });

      await waitForTransactionReceipt(config, { hash });

      setRewardPoolData({
        ...rewardPoolData,
        attach: {
          ...rewardPoolData.attach,
          success: true,
          loading: false,
        },
      });
      setSupportsRewardsModule(true);
    } catch (e: any) {
      handleError(e, "Something went wrong during the rewards module deployment or attachment.");
      setRewardPoolData({
        ...rewardPoolData,
        deploy: {
          ...rewardPoolData.deploy,
          error: true,
        },
      });
    }
  }

  return { deployRewardsPool };
}
