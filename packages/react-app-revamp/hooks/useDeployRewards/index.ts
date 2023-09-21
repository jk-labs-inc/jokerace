import DeployedContestContract from "@contracts/bytecodeAndAbi//Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { useEthersSigner } from "@helpers/ethers";
import { useContestStore } from "@hooks/useContest/store";
import { useContractFactoryStore } from "@hooks/useContractFactory";
import { useError } from "@hooks/useError";
import { prepareWriteContract, waitForTransaction, writeContract } from "@wagmi/core";
import { Contract, ContractFactory } from "ethers";
import { useRouter } from "next/router";
import { useDeployRewardsStore } from "./store";

export function useDeployRewardsPool() {
  const { asPath } = useRouter();
  const stateContestDeployment = useContractFactoryStore(state => state);
  const setSupportsRewardsModule = useContestStore(state => state.setSupportsRewardsModule);
  const { ranks, shares, setDeployRewardsData, setIsLoading, setError, setIsSuccess, setDisplayCreatePool } =
    useDeployRewardsStore(state => state);
  const { error, handleError } = useError();
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
