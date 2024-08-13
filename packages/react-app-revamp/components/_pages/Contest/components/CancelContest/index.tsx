import { TrashIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { useContestState } from "@hooks/useContestState";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { useAccount } from "wagmi";

const CancelContest = () => {
  const { address } = useAccount();
  const { contestAuthorEthereumAddress } = useContestStore(state => state);
  const { cancelContest, isLoading, isConfirmed } = useContestState();
  const { contestState } = useContestStateStore(state => state);

  if (address !== contestAuthorEthereumAddress) return null;

  if (isConfirmed && !isLoading) return null;

  if (contestState === ContestStateEnum.Canceled) return null;

  return (
    <button
      disabled={isLoading}
      onClick={() => {
        cancelContest();
      }}
    >
      <TrashIcon className="w-6 h-6 text-negative-11" />
    </button>
  );
};

export default CancelContest;
