import ButtonV3 from "@components/UI/ButtonV3";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import { ethers } from "ethers";
import Image from "next/image";
import { FC, useState } from "react";
import { useAccount } from "wagmi";

interface CreateRewardsFundingPoolSubmitProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CreateRewardsFundingPoolSubmit: FC<CreateRewardsFundingPoolSubmitProps> = ({ onClick }) => {
  const { sendFundsToRewardsModuleV3 } = useFundRewardsModule();
  const { address } = useAccount();
  const rewards = useFundRewardsStore(state => state.rewards);
  const deployRewardsData = useDeployRewardsStore(state => state.deployRewardsData);

  const [shake, setShake] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const populatedRewards =
      rewards.length > 0 &&
      rewards
        .filter(reward => reward.amount !== "") // Add this line
        .map(reward => ({
          ...reward,
          currentUserAddress: address,
          tokenAddress: reward.address,
          isErc20: reward.address.startsWith("0x"),
          rewardsContractAddress: deployRewardsData.address,
          amount: ethers.utils.parseUnits(reward.amount, 18).toString(),
        }));
    await sendFundsToRewardsModuleV3({ rewards: populatedRewards });
  };

  return (
    <div className="flex gap-2 items-start pb-5 md:pb-0">
      <div className={`flex flex-col items-center gap-2`}>
        <ButtonV3 color="bg-gradient-create" size="large" onClick={handleClick}>
          fund pool!
        </ButtonV3>

        <div className="hidden lg:flex items-center gap-[2px] cursor-pointer group">
          <p className="text-[16px]">i’ll worry about this later</p>
        </div>
      </div>
      <div className="hidden lg:flex lg:items-center mt-[5px] gap-[5px]">
        <p className="text-[16px] ml-[15px]">
          press <span className="font-bold capitalize">enter</span>
        </p>
        <Image src="/create-flow/enter.svg" alt="enter" width={14} height={14} />
      </div>
    </div>
  );
};

export default CreateRewardsFundingPoolSubmit;
