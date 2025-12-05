import { config } from "@config/wagmi";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useContestState } from "@hooks/useContestState";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import { switchChain } from "@wagmi/core";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import CancelContestModal from "./components/Modal";

const CancelContest = () => {
  const { address, chainId } = useAccount();
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const contestAuthorEthereumAddress = useContestStore(useShallow(state => state.contestAuthorEthereumAddress));
  const { cancelContest, isLoading, isConfirmed } = useContestState();
  const { contestState } = useContestStateStore(state => state);
  const {
    totalVotesCast,
    isLoading: isLoadingTotalVotesCast,
    isError: isErrorTotalVotesCast,
  } = useTotalVotesCastOnContest(contestConfig.address, contestConfig.chainId);
  const [isCloseContestModalOpen, setIsCloseContestModalOpen] = useState(false);

  if (address !== contestAuthorEthereumAddress) return null;
  if (contestState === ContestStateEnum.Canceled) return null;
  if (isConfirmed && !isLoading) return null;

  if (totalVotesCast && Number(totalVotesCast) > 0 && !isLoadingTotalVotesCast && !isErrorTotalVotesCast) {
    return null;
  }

  const handleOpenModal = () => setIsCloseContestModalOpen(true);

  const handleCancelContest = async () => {
    if (!contestConfig.chainId) return;

    if (contestConfig.chainId !== chainId) {
      await switchChain(config, { chainId: contestConfig.chainId });
    }

    cancelContest();
    setIsCloseContestModalOpen(false);
  };

  return (
    <>
      <button disabled={isLoading} onClick={handleOpenModal}>
        <TrashIcon className="w-6 h-6 text-negative-11 hover:text-negative-10 transition-colors duration-300 ease-in-out" />
      </button>

      <CancelContestModal
        isCloseContestModalOpen={isCloseContestModalOpen}
        setIsCloseContestModalOpen={setIsCloseContestModalOpen}
        cancelContestHandler={handleCancelContest}
      />
    </>
  );
};

export default CancelContest;
