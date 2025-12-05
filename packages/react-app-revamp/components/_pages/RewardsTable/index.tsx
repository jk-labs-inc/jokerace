import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC } from "react";
import { Abi } from "viem";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";

interface RewardsTableShareProps {
  payee: number;
  totalPayees: number;
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  chainId: number;
  totalShares: number;
}

export const RewardsTableShare: FC<RewardsTableShareProps> = ({ ...props }) => {
  const { payee, contractRewardsModuleAddress, abiRewardsModule, totalShares, totalPayees } = props;
  const chainId = useContestConfigStore(useShallow(state => state.contestConfig.chainId));
  const { data, isError, isLoading } = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId,
    functionName: "shares",
    args: [BigInt(payee)],
  }) as any;

  const shareForPayee = ((BigInt(data ?? 0) * BigInt(100)) / BigInt(totalShares)).toString();

  if (isLoading) {
    return (
      <p className="loadingDots list-disc font-sabo-filled text-[14px] text-neutral-14">
        Loading rewards data for rank {`${payee}`}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-[16px] text-negative-11">Something went wrong while fetching ranks, please reload the page.</p>
    );
  }

  return (
    <div
      className={`flex w-full md:w-72 justify-between gap-4 items-center text-neutral-11 font-bold hover:text-positive-11 transition-colors duration-300 ${
        payee !== totalPayees ? "border-b border-primary-2" : ""
      } pb-2`}
    >
      <p className="text-[16px]">
        {payee}
        <sup>{returnOnlySuffix(payee)}</sup> <span className="ml-1">place</span>
      </p>
      <p className="text-[16px]">{shareForPayee}% of rewards</p>
    </div>
  );
};

export default RewardsTableShare;
