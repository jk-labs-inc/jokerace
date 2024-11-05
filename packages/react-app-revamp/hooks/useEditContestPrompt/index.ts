import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { simulateContract, writeContract } from "@wagmi/core";
import { type Abi } from "viem";

interface UseEditContestPromptProps {
  contestAbi: Abi;
  contestAddress: string;
}

const useEditContestPrompt = ({ contestAbi, contestAddress }: UseEditContestPromptProps) => {
  const setContestPrompt = useContestStore(state => state.setContestPrompt);
  const { handleError } = useError();

  const editPrompt = async (newPrompt: string) => {
    toastLoading("updating contest prompt...");

    try {
      const { request } = await simulateContract(config, {
        abi: contestAbi,
        address: contestAddress as `0x${string}`,
        functionName: "setPrompt",
        args: [newPrompt],
      });

      if (!request) {
        toastError("failed to update contest prompt");
        return;
      }

      const hash = await writeContract(config, request);

      if (hash) {
        setContestPrompt(newPrompt);
        toastSuccess("contest prompt updated successfully");
      }
    } catch (error) {
      handleError(error, "failed to update contest prompt");
    }
  };

  return {
    editPrompt,
  };
};

export default useEditContestPrompt;
