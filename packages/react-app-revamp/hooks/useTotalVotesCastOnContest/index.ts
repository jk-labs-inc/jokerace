import { config } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { readContract } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { useTotalVotesCastStore } from "./store";

const useTotalVotesCastOnContest = (address: string, chainId: number) => {
  const { contestAbi: abi } = useContestStore(state => state);
  const { setTotalVotesCast, setIsLoading, setIsError, setIsSuccess } = useTotalVotesCastStore(state => state);

  async function fetchTotalVotesCast() {
    try {
      setIsLoading(true);

      if (!abi) {
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      };

      const totalVotesCast = (await readContract(config, {
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
