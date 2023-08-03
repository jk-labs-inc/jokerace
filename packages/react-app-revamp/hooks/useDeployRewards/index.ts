import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { useEthersSigner } from "@helpers/ethers";
import { useContestStore } from "@hooks/useContest/store";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import { prepareWriteContract, waitForTransaction, writeContract } from "@wagmi/core";
import { Contract, ContractFactory } from "ethers";
import { useRouter } from "next/router";
import { CustomError } from "types/error";
import { useDeployRewardsStore } from "./store";

export function useDeployRewardsPool() {
  const { asPath } = useRouter();
  const stateContestDeployment = useContractFactoryStore(state => state);
  const setSupportsRewardsModule = useContestStore(state => state.setSupportsRewardsModule);
  const { ranks, shares, setDeployRewardsData, setIsLoading, setIsError, setIsSuccess, setDisplayCreatePool } =
    useDeployRewardsStore(state => state);
  const contestAddress = asPath.split("/")[3];
  const signer = useEthersSigner();

  function deployRewardsPool() {
    setIsLoading(true);
    setDisplayCreatePool(false);

    let contractRewardsModule: Contract | null = null;

    const rewardsModuleDeployment = async () => {
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

      const config = await prepareWriteContract({
        ...contractConfig,
        functionName: "setOfficialRewardsModule",
        args: [contractRewardsModule!.address],
      });

      const { hash } = await writeContract(config);

      await waitForTransaction({
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
        } catch (error) {
          stateContestDeployment.setIsLoading(false);
          stateContestDeployment.setIsSuccess(false);
          stateContestDeployment.setError(error as CustomError);
          setIsError(true);
          setDisplayCreatePool(true);
          throw error;
        }
      },
      async () => {
        try {
          return await rewardsModuleAttachment();
        } catch (error) {
          stateContestDeployment.setIsLoading(false);
          stateContestDeployment.setIsSuccess(false);
          stateContestDeployment.setError(error as CustomError);
          setIsError(true);
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
