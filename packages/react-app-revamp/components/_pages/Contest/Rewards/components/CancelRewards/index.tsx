import { config } from "@config/wagmi";
import { useCancelRewards } from "@hooks/useCancelRewards";
import { switchChain } from "@wagmi/core";
import { FC, useState } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import CancelRewardsModal from "./components/Modal";

interface CancelRewardsProps {
  rewardsAddress: `0x${string}`;
  abi: Abi;
  chainId: number;
  version: string;
}

const CancelRewards: FC<CancelRewardsProps> = ({ rewardsAddress, abi, chainId, version }) => {
  const { cancelRewards, isLoading } = useCancelRewards({ rewardsAddress, abi, chainId, version });
  const [isCancelRewardsModalOpen, setIsCancelRewardsModalOpen] = useState(false);
  const { chainId: accountChainId } = useAccount();
  const isUserOnCorrectChain = accountChainId === chainId;
  const handleOpenModal = () => setIsCancelRewardsModalOpen(true);

  const handleCancelRewards = async () => {
    if (!isUserOnCorrectChain) {
      await switchChain(config, { chainId });
    }

    cancelRewards();
    setIsCancelRewardsModalOpen(false);
  };

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
