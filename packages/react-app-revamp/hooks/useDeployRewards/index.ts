import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { writeContract } from "@wagmi/core";
import { Contract, ContractFactory } from "ethers";
import { CustomError } from "types/error";
import { useNetwork, useSigner } from "wagmi";
import { useDeployRewardsStore } from "./store";

export function useDeployRewardsPool() {
  const stateContestDeployment = useContractFactoryStore(state => state);
  const { ranks, shares, setDeployRewardsData, setIsLoading, setIsError, setIsSuccess, setDisplayCreatePool } =
    useDeployRewardsStore(state => state);
  const deployContestData = useDeployContestStore(state => state.deployContestData);
  const { chain } = useNetwork();
  const { refetch } = useSigner();

  function deployRewardsPool() {
    setIsLoading(true);
    setDisplayCreatePool(false);

    let contractRewardsModule: Contract | null = null;

    const rewardsModuleDeployment = async () => {
      const signer = await refetch();
      const factoryCreateRewardsModule = new ContractFactory(
        RewardsModuleContract.abi,
        RewardsModuleContract.bytecode,
        //@ts-ignore
        signer.data,
      );
      contractRewardsModule = await factoryCreateRewardsModule.deploy(ranks, shares, deployContestData.address, true);
      await contractRewardsModule.deployTransaction.wait();

      setDeployRewardsData(contractRewardsModule.deployTransaction.hash, contractRewardsModule.address);

      return contractRewardsModule;
    };

    const rewardsModuleAttachment = async () => {
      const contractConfig = {
        addressOrName: deployContestData.address,
        contractInterface: DeployedContestContract.abi,
      };
      const txSetRewardsModule = await writeContract({
        ...contractConfig,
        functionName: "setOfficialRewardsModule",
        args: [contractRewardsModule!.address],
      });
      await txSetRewardsModule.wait();

      setIsLoading(false);
      setIsSuccess(true);
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
