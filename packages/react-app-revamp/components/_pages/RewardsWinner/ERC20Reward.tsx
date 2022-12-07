import { utils } from "ethers";
import toast from "react-hot-toast";
import { useBalance, useContractRead, useContractWrite, useNetwork, useToken, useWaitForTransaction } from "wagmi";
import Reward from "./Reward";
interface PayeeERC20RewardProps {
  payee: string | number;
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
      console.error(e?.message, e?.cause);
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
      console.error(e?.message, e?.cause);
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
      console.error(e);
      //@ts-ignore
      toast.error("Something went wrong and the transaction failed :", e?.message);
    },
    async onSuccess() {
      await queryTokenBalance.refetch();
      await queryRankRewardsReleased.refetch();
      await queryRankRewardsReleasable.refetch();
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

export default PayeeERC20Reward;
