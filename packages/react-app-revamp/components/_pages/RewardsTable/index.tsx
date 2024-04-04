import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { ordinalSuffix } from "@helpers/ordinalSuffix";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useReadContract } from "wagmi";

interface RewardsTableShareProps {
  payee: any;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
  totalShares: number;
  isLast: boolean;
}

export const RewardsTableShare: FC<RewardsTableShareProps> = ({ ...props }) => {
  const { payee, contractRewardsModuleAddress, abiRewardsModule, totalShares } = props;
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname ?? "");
  const { data, isError, isLoading } = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId: chains.filter((chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]
      ?.id,
    functionName: "shares",
    args: [Number(payee)],
  }) as any;
  const shareForPayee = ((BigInt(data ?? 0) * BigInt(100)) / BigInt(totalShares)).toString();

  if (isLoading) {
    return (
      <p className="loadingDots list-disc font-sabo text-[14px] text-neutral-14">
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
    <div className="flex flex-col gap-4 md:w-[277px]">
      <div
        className={`flex justify-between items-end text-[16px] font-bold ${
          !props.isLast ? "border-b border-neutral-10" : ""
        } pb-3`}
      >
        <p>{ordinalSuffix(parseFloat(payee))} place</p>
        <p>{shareForPayee}% of rewards</p>
      </div>
    </div>
  );
};

export default RewardsTableShare;
