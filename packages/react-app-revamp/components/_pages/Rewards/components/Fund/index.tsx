import MultiStepToast, { ToastMessage } from "@components/UI/MultiStepToast";
import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import useFundRewardsModule from "@hooks/useFundRewards";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import { fetchToken, readContract } from "@wagmi/core";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { FC, useRef } from "react";
import { toast } from "react-toastify";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import CreateRewardsFundingPoolSubmit from "./components/Buttons/Submit";
import CreateRewardsFundPool from "./components/FundPool";

interface CreateRewardsFundingProps {
  isFundingForTheFirstTime?: boolean;
}

const CreateRewardsFunding: FC<CreateRewardsFundingProps> = ({ isFundingForTheFirstTime = true }) => {
  const { asPath } = useRouter();
  const contestAddress = asPath.split("/")[3];
  const contestChainName = asPath.split("/")[2];
  const chainId = chains.filter(
    chain => chain.name.toLowerCase().replace(" ", "") === contestChainName.toLowerCase(),
  )?.[0]?.id;
  const { sendFundsToRewardsModuleV3 } = useFundRewardsModule();
  const { address } = useAccount();
  const { rewards, setCancel } = useFundRewardsStore(state => state);
  const toastIdRef = useRef<string | number | null>(null);

  const fundPool = async () => {
    if (rewards.length === 0) return;

    const populatedRewardsPromises = rewards.map(async reward => {
      if (reward.amount === "") return null;

      const rewardsContractAddress = await getRewardsModuleAddress();

      if (rewardsContractAddress === "0x0000000000000000000000000000000000000000") {
        toastError("there is no rewards module for this contest!");
        return;
      }

      let decimals = 18;
      if (reward.address.startsWith("0x")) {
        const tokenData = await fetchToken({ address: reward.address as `0x${string}` });
        if (tokenData === null) {
          toastError("failed to fetch token data");
          return;
        }
        decimals = tokenData.decimals;
      }

      return {
        ...reward,
        currentUserAddress: address,
        tokenAddress: reward.address,
        isErc20: reward.address.startsWith("0x"),
        rewardsContractAddress: rewardsContractAddress,
        amount: ethers.utils.parseUnits(reward.amount, decimals).toString(),
      };
    });

    const populatedRewards = (await Promise.all(populatedRewardsPromises)).filter(Boolean);
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

  const getRewardsModuleAddress = async () => {
    const { abi: abiContest } = await getContestContractVersion(contestAddress, chainId);

    if (abiContest === null) {
      toastError(`This contract doesn't exist on ${contestChainName}.`);
      return;
    }

    try {
      const contestRewardModuleAddress = (await readContract({
        address: contestAddress as `0x${string}`,
        abi: abiContest as unknown as Abi,
        chainId,
        functionName: "officialRewardsModule",
      })) as string;

      return contestRewardModuleAddress;
    } catch (error) {
      toastError("failed to fetch rewards module address");
      return;
    }
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
