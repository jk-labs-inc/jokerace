import { toastDismiss, toastError, toastSuccess } from "@components/UI/Toast";
import { utils } from "ethers";
import { toast } from "react-toastify";
import { CustomError, ErrorCodes } from "types/error";
import { useBalance, useContractRead, useContractWrite, useNetwork, useToken, useWaitForTransaction } from "wagmi";
import Reward from "../Reward";

interface PayeeERC20RewardProps {
  payee: number;
  tokenAddress: string;
  share: any;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
}

export const PayeeERC20Reward = (props: PayeeERC20RewardProps) => {
  const { payee, tokenAddress, share, contractRewardsModuleAddress, abiRewardsModule, chainId } = props;

  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    chainId,
    token: tokenAddress,
  });
  const queryRankRewardsReleasable = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId,
    functionName: "releasable(address,uint256)",
    args: [tokenAddress, parseInt(`${payee}`)],
    //@ts-ignore
    select: data => {
      return parseFloat(utils.formatEther(data)).toFixed(4);
    },
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

  const queryRankRewardsReleased = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId,
    functionName: "released(address,uint256)",
    args: [tokenAddress, parseInt(`${payee}`)],
    //@ts-ignore
    select: data => {
      return parseFloat(utils.formatEther(data)).toFixed(4);
    },
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

  const contractWriteReleaseToken = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release(address,uint256)",
    args: [tokenAddress, parseInt(`${payee}`)],
    chainId,
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
    async onSuccess() {
      await queryTokenBalance.refetch();
      await queryRankRewardsReleased.refetch();
      await queryRankRewardsReleasable.refetch();
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

export default PayeeERC20Reward;
