import { utils } from "ethers";
import { toast } from "react-toastify";
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
      toast.error(`${e.cause} ${e.message}`);
    },
  });

  const txRelease = useWaitForTransaction({
    hash: contractWriteReleaseToken?.data?.hash,
    chainId,
    onError(e) {
      console.error(e);
      toast.error(`Something went wrong and the transaction failed :", ${e?.message}`);
    },
    onSuccess() {
      toast.success("Transaction successful !");
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
