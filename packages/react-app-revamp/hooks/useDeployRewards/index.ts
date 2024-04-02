import { config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { getEthersSigner } from "@helpers/ethers";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import { useError } from "@hooks/useError";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { Contract, ContractFactory } from "ethers";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useDeployRewardsStore } from "./store";

export function useDeployRewardsPool() {
  const { chainId } = useAccount();
  const asPath = usePathname();
  const { address: contestAddress } = extractPathSegments(asPath ?? "");
  const stateContestDeployment = useContractFactoryStore(state => state);
  const setSupportsRewardsModule = useContestStore(state => state.setSupportsRewardsModule);
  const { ranks, shares, setDeployRewardsData, setIsLoading, setError, setIsSuccess, setDisplayCreatePool } =
    useDeployRewardsStore(state => state);
  const { error, handleError } = useError();

  function deployRewardsPool() {
    setIsLoading(true);
    setDisplayCreatePool(false);

    let contractRewardsModule: Contract | null = null;

    const rewardsModuleDeployment = async () => {
      const signer = await getEthersSigner(config, { chainId });

      const factoryCreateRewardsModule = new ContractFactory(
        RewardsModuleContract.abi,
        RewardsModuleContract.bytecode,
        signer,
      );
      contractRewardsModule = await factoryCreateRewardsModule.deploy(ranks, shares, contestAddress, false);
      await contractRewardsModule.deployTransaction.wait();

      setDeployRewardsData(contractRewardsModule.deployTransaction.hash, contractRewardsModule.address);

      return contractRewardsModule;
    };

    const rewardsModuleAttachment = async () => {
      const contractConfig = {
        address: contestAddress as `0x${string}`,
        abi: DeployedContestContract.abi,
      };

      const { request } = await simulateContract(config, {
        ...contractConfig,
        functionName: "setOfficialRewardsModule",
        args: [contractRewardsModule!.address],
      });

      const hash = await writeContract(config, {
        ...request,
      });

      await waitForTransactionReceipt(config, {
        hash,
      });

      setIsLoading(false);
      setIsSuccess(true);
      setSupportsRewardsModule(true);
    };

    return [
      async () => {
        try {
          return await rewardsModuleDeployment();
        } catch (e) {
          handleError(e, "Something went wrong and the rewards module couldn't be deployed.");
          setError(error);
          setIsLoading(false);
          setIsSuccess(false);
          setDisplayCreatePool(true);
          throw error;
        }
      },
      async () => {
        try {
          return await rewardsModuleAttachment();
        } catch (e) {
          handleError(e, "Something went wrong and the rewards module couldn't be attached.");
          stateContestDeployment.setIsLoading(false);
          stateContestDeployment.setIsSuccess(false);
          stateContestDeployment.setError(error);
          setError(error);
          setIsLoading(false);
          setIsSuccess(false);
          setDisplayCreatePool(true);
          throw error;
        }
      },
    ];
  }

  return {
    deployRewardsPool,
  };
}
