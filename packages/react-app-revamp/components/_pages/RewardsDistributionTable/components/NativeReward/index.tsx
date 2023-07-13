import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { utils } from "ethers";
import { toast } from "react-toastify";
import { CustomError, ErrorCodes } from "types/error";
import { useBalance, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import Reward from "../Reward";

interface PayeeNativeRewardProps {
  payee: number;
  share: any;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
}

export const PayeeNativeReward = (props: PayeeNativeRewardProps) => {
  const { payee, share, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    chainId,
  });
  const queryRankRewardsReleasable = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "releasable(uint256)",
    chainId,
    args: [payee],
    //@ts-ignore
    select: data => parseFloat(utils.formatEther(data)).toFixed(4),
  });

  const queryRankRewardsReleased = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "released(uint256)",
    chainId,
    args: [payee],
    //@ts-ignore
    select: data => parseFloat(utils.formatEther(data)).toFixed(4),
  });

  const contractWriteReleaseToken = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release(uint256)",
    chainId,
    args: [payee],
    onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        return;
      }

      toastError(`something went wrong and the the transaction failed`, customError.message);
    },
  });

  const txRelease = useWaitForTransaction({
    hash: contractWriteReleaseToken?.data?.hash,
    chainId,
    onError(e) {
      const customError = e as CustomError;
      if (!customError) return;

      if (customError.code === ErrorCodes.USER_REJECTED_TX) {
        toastDismiss();
        return;
      }

      toastError(`something went wrong and the the transaction failed`, customError.message);
    },
    onSuccess() {
      toastSuccess("funds distributed successfully !");
    },
  });

  return (
    <Reward
      share={share}
      chainId={chainId}
      queryTokenBalance={queryTokenBalance}
      queryRankRewardsReleasable={queryRankRewardsReleasable}
      queryRankRewardsReleased={queryRankRewardsReleased}
      contractWriteRelease={contractWriteReleaseToken}
      txRelease={txRelease}
    />
  );
};
