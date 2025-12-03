import { config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { getChainId } from "@helpers/getChainId";
import { useCancelRewards } from "@hooks/useCancelRewards";
import { useContestStatusStore } from "@hooks/useContestStatus/store";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import { switchChain } from "@wagmi/core";
import { FC, useState } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import CancelRewardsModal from "./components/Modal";
import { useLocation } from "@tanstack/react-router";

interface CancelRewardsProps {
  rewardsAddress: `0x${string}`;
  abi: Abi;
  chainId: number;
  version: string;
}

const CancelRewards: FC<CancelRewardsProps> = ({ rewardsAddress, abi, chainId, version }) => {
  const location = useLocation();
  const { address: contestAddress, chainName } = extractPathSegments(location.pathname);
  const contestChainId = getChainId(chainName);
  const { cancelRewards, isLoading } = useCancelRewards({ rewardsAddress, abi, chainId, version });
  const { contestStatus } = useContestStatusStore(state => state);
  const {
    totalVotesCast,
    isLoading: isLoadingTotalVotesCast,
    isError: isErrorTotalVotesCast,
  } = useTotalVotesCastOnContest(contestAddress, contestChainId);
  const [isCancelRewardsModalOpen, setIsCancelRewardsModalOpen] = useState(false);
  const { chainId: accountChainId } = useAccount();
  const isUserOnCorrectChain = accountChainId === chainId;
  const cannotCancelRewards = Number(totalVotesCast) > 0 && !isLoadingTotalVotesCast && !isErrorTotalVotesCast;

  const handleOpenModal = () => setIsCancelRewardsModalOpen(true);

  const handleCancelRewards = async () => {
    if (!isUserOnCorrectChain) {
      await switchChain(config, { chainId });
    }

    cancelRewards();
    setIsCancelRewardsModalOpen(false);
  };

  if (cannotCancelRewards) return null;

  return (
    <>
      <button
        disabled={isLoading}
        onClick={handleOpenModal}
        className="text-negative-11 text-[16px] font-bold whitespace-nowrap overflow-visible relative z-10 hover:text-negative-10 transition-colors duration-200"
      >
        🗑️ cancel rewards <span className="text-neutral-9">(required to withdraw funds)</span>
      </button>

      <CancelRewardsModal
        isCancelRewardsModalOpen={isCancelRewardsModalOpen}
        setIsCancelRewardsModalOpen={setIsCancelRewardsModalOpen}
        cancelRewardsHandler={handleCancelRewards}
      />
    </>
  );
};

export default CancelRewards;
