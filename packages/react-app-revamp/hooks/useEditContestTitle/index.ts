import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { simulateContract, writeContract } from "@wagmi/core";
import { type Abi } from "viem";
import { useShallow } from "zustand/shallow";
interface UseEditContestTitleProps {
  contestAbi: Abi;
  contestAddress: string;
}

const useEditContestTitle = ({ contestAbi, contestAddress }: UseEditContestTitleProps) => {
  const setContestName = useContestStore(useShallow(state => state.setContestName));
  const { handleError } = useError();

  const editTitle = async (newName: string) => {
    toastLoading({
      message: "updating contest title...",
    });

    try {
      const { request } = await simulateContract(config, {
        abi: contestAbi,
        address: contestAddress as `0x${string}`,
        functionName: "setName",
        args: [newName],
      });

      if (!request) {
        toastError({
          message: "failed to update contest title",
        });
        return;
      }

      const hash = await writeContract(config, request);

      if (hash) {
        setContestName(newName);
        toastSuccess({
          message: "contest title updated successfully",
        });
      }
    } catch (error) {
      handleError(error, "failed to update contest title");
    }
  };

  return {
    editTitle,
  };
};

export default useEditContestTitle;
