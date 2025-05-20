import DialogAddFundsToRewardsModule from "@components/_pages/DialogAddFundsToRewardsModule";
import { useState } from "react";

const AddRewards = () => {
  const [isAddRewardsModalOpen, setIsAddRewardsModalOpen] = useState(false);

  return (
    <>
      <button className="text-[16px] text-positive-11 font-bold" onClick={() => setIsAddRewardsModalOpen(true)}>
        💸 add funds to rewards pool
      </button>

      <DialogAddFundsToRewardsModule isOpen={isAddRewardsModalOpen} setIsOpen={setIsAddRewardsModalOpen} />
    </>
  );
};

export default AddRewards;
