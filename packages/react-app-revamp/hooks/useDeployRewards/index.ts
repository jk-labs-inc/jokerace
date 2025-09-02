import { useFundPoolStore } from "@components/_pages/Contest/Rewards/components/Create/steps/FundPool/store";
import { CreationStep, useCreateRewardsStore } from "@components/_pages/Contest/Rewards/components/Create/store";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import VotingModuleContract from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.sol/VoterRewardsModule.json";
import { extractPathSegments } from "@helpers/extractPath";
import { setupDeploymentClients } from "@helpers/viem";
import { useCreatorSplitDestination } from "@hooks/useCreatorSplitDestination";
import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { useQueryClient } from "@tanstack/react-query";
import { estimateGas, sendTransaction, simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { insertContestWithOfficialModule } from "lib/rewards/database";
import { usePathname } from "next/navigation";
import { didUserReject } from "utils/error";
import { erc20Abi, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

export function useDeployRewardsPool() {
  const { address: userAddress } = useAccount();
  const asPath = usePathname();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.id;
  const { rewardPoolData, setRewardPoolData, setStep, addEarningsToRewards, resetCreateRewardsStore } =
    useCreateRewardsStore(
      useShallow(state => ({
        rewardPoolData: state.rewardPoolData,
        setRewardPoolData: state.setRewardPoolData,
        setStep: state.setStep,
        addEarningsToRewards: state.addEarningsToRewards,
        resetCreateRewardsStore: state.reset,
      })),
    );
  const { tokenWidgets, setTokenWidgets } = useFundPoolStore(
    useShallow(state => ({
      tokenWidgets: state.tokenWidgets,
      setTokenWidgets: state.setTokenWidgets,
    })),
  );
  const { setCreatorSplitDestination } = useCreatorSplitDestination();
  const queryClient = useQueryClient();

  async function deployRewardsPool() {
    let contractRewardsModuleAddress: `0x${string}` | null | undefined;

    try {
      contractRewardsModuleAddress = await deployRewardsModule();

      if (!contractRewardsModuleAddress) {
        throw new Error("Failed to deploy rewards module");
      }

      await attachRewardsModule(contractRewardsModuleAddress);
      await fundPoolTokens(contractRewardsModuleAddress);

      if (addEarningsToRewards) {
        await setCreatorSplitDestinationToRewardsPool(contractRewardsModuleAddress);
      }

      try {
        await insertContestWithOfficialModule(contestAddress, chainName);
      } catch (error) {
        console.error("Failed to insert contest with official module:", error);
      }

      resetCreateRewardsStore();
      setTokenWidgets([]);

      await queryClient.invalidateQueries({
        queryKey: ["rewards-module", contestAddress],
      });
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
      if (!chainId || !userAddress) {
        throw new Error("Failed to deploy rewards module");
      }

      const { walletClient, publicClient, chain } = await setupDeploymentClients(userAddress, chainId);
      const baseParams = [rewardPoolData.rankings, rewardPoolData.shareAllocations, contestAddress, []];

      const contractRewardsModuleHash = await walletClient.deployContract({
        abi: VotingModuleContract.abi,
        bytecode: VotingModuleContract.bytecode.object as `0x${string}`,
        args: [...baseParams],
        account: userAddress as `0x${string}`,
        chain: chain,
      });

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: contractRewardsModuleHash,
      });

      const contractRewardsModuleAddress = receipt?.contractAddress;

      setRewardPoolData(prevData => ({
        ...prevData,
        deploy: { ...prevData.deploy, success: true, loading: false, error: false },
      }));

      return contractRewardsModuleAddress;
    } catch (e) {
      console.error("Failed to deploy rewards module:", e);
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
        args: [contractRewardsModuleAddress as `0x${string}`],
      });

      const hash = await writeContract(config, request);

      await waitForTransactionReceipt(config, { hash });

      setRewardPoolData(prevData => ({
        ...prevData,
        attach: { ...prevData.attach, success: true, loading: false, error: false },
      }));
    } catch (e) {
      console.error("Failed to attach rewards module:", e);
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
