import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { useContestState } from "@hooks/useContestState";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
import CancelContestModal from "./components/Modal";

const CancelContest = () => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const contestChainId = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.id;
  const { address, chainId } = useAccount();
  const isUserOnCorrectChain = contestChainId === chainId;
  const { contestAuthorEthereumAddress } = useContestStore(state => state);
  const { cancelContest, isLoading, isConfirmed } = useContestState();
  const { contestState } = useContestStateStore(state => state);
  const [isCloseContestModalOpen, setIsCloseContestModalOpen] = useState(false);
  const isAuthor = address === contestAuthorEthereumAddress;
  const isNotCanceled = contestState !== ContestStateEnum.Canceled;
  const shouldRender = isAuthor && isNotCanceled && (!isConfirmed || isLoading);

  if (!shouldRender) return null;

  const handleOpenModal = () => setIsCloseContestModalOpen(true);

  const handleCancelContest = async () => {
    if (!contestChainId) return;

    if (!isUserOnCorrectChain) {
      await switchChain(config, { chainId: contestChainId });
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
