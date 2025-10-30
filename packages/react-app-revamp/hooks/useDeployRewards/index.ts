import { useFundPoolStore } from "@components/_pages/Create/pages/ContestRewards/components/FundPool/store";
import { config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import VotingModuleContract from "@contracts/bytecodeAndAbi/modules/VoterRewardsModule.sol/VoterRewardsModule.json";
import { getChainFromId } from "@helpers/getChainFromId";
import { setupDeploymentClients } from "@helpers/viem";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useQueryClient } from "@tanstack/react-query";
import { estimateGas, sendTransaction, simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { insertContestWithOfficialModule } from "lib/rewards/database";
import { didUserReject } from "utils/error";
import { erc20Abi, parseUnits } from "viem";
import { useShallow } from "zustand/shallow";

export function useDeployRewardsPool() {
  const { rewardPoolData, setRewardPoolData, resetCreateRewardsStore } = useDeployContestStore(
    useShallow(state => ({
      rewardPoolData: state.rewardPoolData,
      setRewardPoolData: state.setRewardPoolData,
      resetCreateRewardsStore: state.resetStore,
    })),
  );
  const { tokenWidgets, setTokenWidgets } = useFundPoolStore(
    useShallow(state => ({
      tokenWidgets: state.tokenWidgets,
      setTokenWidgets: state.setTokenWidgets,
    })),
  );
  const queryClient = useQueryClient();

  async function deployRewardsPool(contestAddress: string, contestChainId: number, userAddress: `0x${string}`) {
    let contractRewardsModuleAddress: `0x${string}` | null | undefined;
    const chainName = getChainFromId(contestChainId)?.name.toLowerCase();

    try {
      contractRewardsModuleAddress = await deployRewardsModule(contestAddress, contestChainId, userAddress);

      if (!contractRewardsModuleAddress) {
        throw new Error("Failed to deploy rewards module");
      }

      await attachRewardsModule(contestAddress, contestChainId, contractRewardsModuleAddress);
      await fundPoolTokens(contestAddress, contestChainId, contractRewardsModuleAddress);

      try {
        await insertContestWithOfficialModule(contestAddress, chainName ?? "");
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
        // TODO: add error handling in case user rejected the transaction (return back to reveiw step)
        throw e;
      }
    }
  }

  async function deployRewardsModule(contestAddress: string, contestChainId: number, userAddress: `0x${string}`) {
    setRewardPoolData(prevData => ({
      ...prevData,
      deploy: { ...prevData.deploy, loading: true, error: false, success: false },
    }));

    try {
      const { walletClient, publicClient, chain } = await setupDeploymentClients(userAddress, contestChainId);
      const baseParams = [rewardPoolData.rankings, rewardPoolData.shareAllocations, contestAddress];

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

  async function attachRewardsModule(
    contestAddress: string,
    contestChainId: number,
    contractRewardsModuleAddress: string,
  ) {
    setRewardPoolData(prevData => ({
      ...prevData,
      attach: { ...prevData.attach, loading: true, error: false, success: false },
    }));

    try {
      const contractConfig = {
        address: contestAddress as `0x${string}`,
        chainId: contestChainId,
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

  async function fundPoolTokens(contestAddress: string, contestChainId: number, contractRewardsModuleAddress: string) {
    const chainName = getChainFromId(contestChainId)?.name.toLowerCase();
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
          chainId: contestChainId,
          abi: erc20Abi,
        };

        if (token.address === "native") {
          const amountBigInt = parseUnits(token.amount, token.decimals);

          await estimateGas(config, {
            to: contractRewardsModuleAddress as `0x${string}`,
            chainId: contestChainId,
            value: amountBigInt,
          });

          hash = await sendTransaction(config, {
            to: contractRewardsModuleAddress as `0x${string}`,
            chainId: contestChainId,
            value: amountBigInt,
          });

          receipt = await waitForTransactionReceipt(config, { chainId: contestChainId, hash });
        } else {
          const amountBigInt = parseUnits(token.amount, token.decimals);

          const { request } = await simulateContract(config, {
            ...fundPoolContractConfig,
            functionName: "transfer",
            args: [contractRewardsModuleAddress as `0x${string}`, amountBigInt],
          });

          hash = await writeContract(config, { ...request });

          receipt = await waitForTransactionReceipt(config, { chainId: contestChainId, hash });
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
            network_name: chainName ?? "",
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

  return { deployRewardsPool };
}
