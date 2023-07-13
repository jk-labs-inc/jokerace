import MultiStepToast, { ToastMessage } from "@components/UI/MultiStepToast";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import { useRewardsStore } from "@hooks/useRewards/store";
import { ethers } from "ethers";
import { FC, useRef } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import CreateRewardsFundingPoolSubmit from "./components/Buttons/Submit";
import CreateRewardsFundPool from "./components/FundPool";

interface CreateRewardsFundingProps {
  isFundingForTheFirstTime?: boolean;
}

const CreateRewardsFunding: FC<CreateRewardsFundingProps> = ({ isFundingForTheFirstTime = true }) => {
  const { sendFundsToRewardsModuleV3 } = useFundRewardsModule();
  const { address } = useAccount();
  const { rewards, setCancel } = useFundRewardsStore(state => state);
  const { rewards: rewardsModule } = useRewardsStore(state => state);
  const deployRewardsData = useDeployRewardsStore(state => state.deployRewardsData);
  const toastIdRef = useRef<string | number | null>(null);

  const fundPool = async () => {
    const populatedRewards =
      rewards.length > 0
        ? rewards
            .filter(reward => reward.amount !== "")
            .map(reward => ({
              ...reward,
              currentUserAddress: address,
              tokenAddress: reward.address,
              isErc20: reward.address.startsWith("0x"),
              rewardsContractAddress: deployRewardsData.address
                ? deployRewardsData.address
                : rewardsModule.contractAddress,
              amount: ethers.utils.parseUnits(reward.amount, 18).toString(),
            }))
        : [];

    const promises = await sendFundsToRewardsModuleV3({ rewards: populatedRewards });

    // Don't proceed if promises is empty
    if (!promises || promises.length === 0) {
      return;
    }

    const statusMessages: ToastMessage[] = populatedRewards.map((reward, index) => ({
      message: `Funding reward ${index + 1}/${populatedRewards.length}...`,
      successMessage: `Funded reward ${index + 1}!`,
      status: "pending" as "pending",
    }));

    toastIdRef.current = toast(
      <MultiStepToast
        messages={statusMessages}
        promises={promises}
        toastIdRef={toastIdRef}
        completionMessage="All rewards have been funded!"
      />,
      {
        position: "bottom-center",
        bodyClassName: "text-[16px] font-bold",
        autoClose: false,
        icon: false,
      },
    );
  };

  const onCancelFundingPool = () => {
    setCancel(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <p className="text-[24px] font-bold text-primary-10">
          {isFundingForTheFirstTime ? "last step!" : ""} let’s fund this rewards pool 💸
        </p>
        <div className="text-[16px] flex flex-col gap-2">
          <p>if you’re ready, let’s fund the rewards pool below.</p>
          <p>
            likewise, <span className="italic">literally anyone</span> (including you!) can always fund it later by{" "}
            <br />
            sending tokens to the address on the rewards page.
          </p>
          <p>
            just remember: <span className="font-bold">rewards must be on the same chain as the contest.</span>
          </p>
        </div>
      </div>
      <div className="mt-12">
        <p className="text-[24px] font-bold text-primary-10">what tokens should we add?</p>
      </div>
      <div className="mt-8">
        <CreateRewardsFundPool />
      </div>
      <div className="mt-10">
        <CreateRewardsFundingPoolSubmit onClick={fundPool} onCancel={onCancelFundingPool} />
      </div>
    </div>
  );
};

export default CreateRewardsFunding;
