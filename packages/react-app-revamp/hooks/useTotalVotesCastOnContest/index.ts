import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { useTotalVotesCastStore } from "./store";
import { Abi } from "viem";

const useTotalVotesCastOnContest = (address: string, chainId: number) => {
  const { setTotalVotesCast, setIsLoading, setIsError, setIsSuccess } = useTotalVotesCastStore(state => state);

  async function getContractConfig() {
    try {
      const { abi, version } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi as unknown as Abi,
        chainId: chainId,
      };

      return { contractConfig, version };
    } catch (e) {
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  async function fetchTotalVotesCast() {
    try {
      setIsLoading(true);
      const result = await getContractConfig();
      if (!result) return;

      const { contractConfig } = result;

      const totalVotesCast = (await readContract({
        ...contractConfig,
        functionName: "totalVotesCast",
        args: [],
      })) as bigint;

      const totalVotesCastBN = BigNumber.from(totalVotesCast);

      const totalVotesCastFormatted = parseFloat(utils.formatEther(totalVotesCastBN));

      setTotalVotesCast(totalVotesCastFormatted);
      setIsSuccess(true);
      setIsLoading(false);
    } catch {
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }

  function retry() {
    fetchTotalVotesCast();
  }

  return {
    fetchTotalVotesCast,
    retry,
  };
};

export default useTotalVotesCastOnContest;
