import { useFundPoolStore } from "@components/_pages/Contest/Rewards/components/Create/steps/FundPool/store";
import { CreationStep, useCreateRewardsStore } from "@components/_pages/Contest/Rewards/components/Create/store";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import RewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { getEthersSigner } from "@helpers/ethers";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useCreatorSplitDestination } from "@hooks/useCreatorSplitDestination";
import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { estimateGas, sendTransaction, simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { ContractFactory } from "ethers";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { didUserReject } from "utils/error";
import { erc20Abi, parseUnits } from "viem";

export function useDeployRewardsPool() {
  const asPath = usePathname();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.id;
  const setSupportsRewardsModule = useContestStore(state => state.setSupportsRewardsModule);
  const { rewardPoolData, setRewardPoolData, setStep, addEarningsToRewards } = useCreateRewardsStore(state => state);
  const { tokenWidgets, setTokenWidgets } = useFundPoolStore(state => state);
  const { setCreatorSplitDestination } = useCreatorSplitDestination();

  async function deployRewardsPool() {
    let contractRewardsModuleAddress: string;

    try {
      contractRewardsModuleAddress = await deployRewardsModule();
      await attachRewardsModule(contractRewardsModuleAddress);
      await fundPoolTokens(contractRewardsModuleAddress);

      if (addEarningsToRewards) {
        await setCreatorSplitDestinationToRewardsPool(contractRewardsModuleAddress);
      }

      setSupportsRewardsModule(true);
      setTokenWidgets([]);
    } catch (e: any) {
      if (didUserReject(e)) {
        setStep(CreationStep.Review);
      }
    }
  }

  async function deployRewardsModule() {
    setRewardPoolData(prevData => ({
      ...prevData,
      deploy: { ...prevData.deploy, loading: true, error: false, success: false },
    }));

    try {
      console.log("deploying rewards module", chainId);
      const signer = await getEthersSigner(config, { chainId });

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

      setRewardPoolData(prevData => ({
        ...prevData,
        deploy: { ...prevData.deploy, success: true, loading: false, error: false },
      }));

      return contractRewardsModule.address;
    } catch (e) {
      setRewardPoolData(prevData => ({
        ...prevData,
        deploy: { ...prevData.deploy, loading: false, success: false, error: true },
      }));
      throw e;
    }
  }

  async function attachRewardsModule(contractRewardsModuleAddress: string) {
    setRewardPoolData(prevData => ({
      ...prevData,
      attach: { ...prevData.attach, loading: true, error: false, success: false },
    }));

    try {
      const contractConfig = {
        address: contestAddress as `0x${string}`,
        abi: DeployedContestContract.abi,
      };

      const { request } = await simulateContract(config, {
        ...contractConfig,
        functionName: "setOfficialRewardsModule",
        args: [contractRewardsModuleAddress],
      });

      const hash = await writeContract(config, { ...request });

      await waitForTransactionReceipt(config, { hash });

      setRewardPoolData(prevData => ({
        ...prevData,
        attach: { ...prevData.attach, success: true, loading: false, error: false },
      }));
    } catch (e) {
      setRewardPoolData(prevData => ({
        ...prevData,
        attach: { ...prevData.attach, loading: false, success: false, error: true },
      }));
      throw e;
    }
  }

  async function fundPoolTokens(contractRewardsModuleAddress: string) {
    // exit early if all token amounts are 0
    if (tokenWidgets.every(token => parseFloat(token.amount) === 0)) {
      return;
    }

    for (const token of tokenWidgets) {
      // skip tokens with 0 amount
      if (parseFloat(token.amount) === 0) {
        continue;
      }

      const transactionKey = `fund_${token.symbol}` as const;

      setRewardPoolData(prevData => ({
        ...prevData,
        [transactionKey]: { loading: true, error: false, success: false },
      }));

      try {
        let hash: `0x${string}`;
        let receipt;

        const fundPoolContractConfig = {
          address: token.address as `0x${string}`,
          chainId: chainId,
          abi: erc20Abi,
        };

        if (token.address === "native") {
          const amountBigInt = parseUnits(token.amount, token.decimals);

          await estimateGas(config, {
            to: contractRewardsModuleAddress as `0x${string}`,
            chainId,
            value: amountBigInt,
          });

          hash = await sendTransaction(config, {
            to: contractRewardsModuleAddress as `0x${string}`,
            chainId,
            value: amountBigInt,
          });

          receipt = await waitForTransactionReceipt(config, { chainId, hash });
        } else {
          const amountBigInt = parseUnits(token.amount, token.decimals);

          const { request } = await simulateContract(config, {
            ...fundPoolContractConfig,
            functionName: "transfer",
            args: [contractRewardsModuleAddress as `0x${string}`, amountBigInt],
          });

          hash = await writeContract(config, { ...request });

          receipt = await waitForTransactionReceipt(config, { chainId, hash });
        }

        setRewardPoolData(prevData => ({
          ...prevData,
          [transactionKey]: { loading: false, error: false, success: true },
        }));

        // future improvement: catch this better as an error, if tx is success but db is not, user just needs to retry upload to db?
        try {
          await updateRewardAnalytics({
            contest_address: contestAddress,
            rewards_module_address: contractRewardsModuleAddress,
            network_name: chainName,
            amount: parseFloat(token.amount),
            operation: "deposit",
            token_address: token.address === "native" ? null : token.address,
            created_at: Math.floor(Date.now() / 1000),
          });
        } catch (error) {
          console.error("Error while updating reward analytics", error);
        }
      } catch (tokenError) {
        setRewardPoolData(prevData => ({
          ...prevData,
          [transactionKey]: { loading: false, error: true, success: false },
        }));
      }
    }
  }

  async function setCreatorSplitDestinationToRewardsPool(contractRewardsModuleAddress: string) {
    setRewardPoolData(prevData => ({
      ...prevData,
      setCreatorSplitDestination: { loading: true, error: false, success: false },
    }));

    try {
      await setCreatorSplitDestination({
        type: SplitFeeDestinationType.RewardsPool,
        address: contractRewardsModuleAddress,
      });

      setRewardPoolData(prevData => ({
        ...prevData,
        setCreatorSplitDestination: { loading: false, error: false, success: true },
      }));
    } catch (e) {
      setRewardPoolData(prevData => ({
        ...prevData,
        setCreatorSplitDestination: { loading: false, success: false, error: true },
      }));
      throw e;
    }
  }

  return { deployRewardsPool, deployRewardsModule, attachRewardsModule, fundPoolTokens };
}
