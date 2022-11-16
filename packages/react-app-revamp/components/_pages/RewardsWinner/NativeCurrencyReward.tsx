import { utils } from "ethers";
import toast from "react-hot-toast";
import { useBalance, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import Reward from "./Reward";

interface PayeeNativeRewardProps {
  payee: string | number;
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
    watch: true,
  });
  const queryRankRewardsReleasable = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "releasable(uint256)",
    chainId,
    args: [payee],
    watch: true,
    //@ts-ignore
    select: data => parseFloat(utils.formatEther(data)).toFixed(4),
  });

  const queryRankRewardsReleased = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "released(uint256)",
    chainId,
    watch: true,
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
      //@ts-ignore
      toast.error("Something went wrong and the transaction failed :", e?.message);
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

export default PayeeNativeReward;
