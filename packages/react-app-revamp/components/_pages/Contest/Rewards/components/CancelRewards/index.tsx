import { useCancelRewards } from "@hooks/useCancelRewards";
import { FC, useState } from "react";
import CancelRewardsModal from "./components/Modal";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Abi } from "viem";

interface CancelRewardsProps {
  rewardsAddress: `0x${string}`;
  abi: Abi;
  chainId: number;
  version: string;
}

const CancelRewards: FC<CancelRewardsProps> = ({ rewardsAddress, abi, chainId, version }) => {
  const { cancelRewards, isLoading } = useCancelRewards({ rewardsAddress, abi, chainId, version });
  const [isCancelRewardsModalOpen, setIsCancelRewardsModalOpen] = useState(false);

  const handleOpenModal = () => setIsCancelRewardsModalOpen(true);

  const handleCancelRewards = async () => {
    cancelRewards();
    setIsCancelRewardsModalOpen(false);
  };

  return (
    <>
      <button disabled={isLoading} onClick={handleOpenModal}>
        <TrashIcon className="w-6 h-6 text-negative-11 hover:text-negative-10 transition-colors duration-300 ease-in-out" />
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
