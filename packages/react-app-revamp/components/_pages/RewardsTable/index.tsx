import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import useAllRewardsTokens from "@hooks/useRewardsTokens/useAllRewardsTokens";
import { usePathname } from "next/navigation";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface RewardsTableShareProps {
  payee: number;
  contractRewardsModuleAddress: string;
  abiRewardsModule: Abi;
  chainId: number;
  totalShares: number;
}

export const RewardsTableShare: FC<RewardsTableShareProps> = ({ ...props }) => {
  const { payee, contractRewardsModuleAddress, abiRewardsModule, totalShares } = props;
  const { allBalances: allRewardsTokens, isLoading: isRewardsTokensLoading } = useAllRewardsTokens(
    "allRewardsTokens",
    contractRewardsModuleAddress,
  );
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname ?? "");
  const { data, isError, isLoading } = useReadContract({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId: chains.filter((chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]
      ?.id,
    functionName: "shares",
    args: [BigInt(payee)],
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

  const handleAmountPerShareAllocation = (amount: number, shareAllocation: number): string => {
    const amountPerShare = (amount / 100) * shareAllocation;
    return formatBalance(amountPerShare.toString());
  };

  return (
    <div className="grid rewards-review-table-grid gap-4 items-center text-neutral-14 hover:text-positive-11 transition-colors duration-300">
      <p className="text-[16px]">
        {payee}
        <sup>{returnOnlySuffix(payee)}</sup> <span className="ml-1">place</span>
      </p>
      <p className="text-[16px]">{shareForPayee}% of rewards</p>
      <div className="flex flex-col md:flex-row gap-1 items-center">
        {isRewardsTokensLoading ? (
          <SkeletonTheme baseColor="#242424" highlightColor="#78FFC6" duration={1}>
            <Skeleton width={100} height={16} />
          </SkeletonTheme>
        ) : allRewardsTokens && allRewardsTokens.length > 0 ? (
          allRewardsTokens.map((token, tokenIndex) => (
            <p className="text-[16px]" key={tokenIndex}>
              {handleAmountPerShareAllocation(parseFloat(token.tokenBalance), parseFloat(shareForPayee))}{" "}
              <span className="uppercase">{token.tokenSymbol}</span>{" "}
              {tokenIndex + 1 < allRewardsTokens.length ? <span>,</span> : null}
            </p>
          ))
        ) : (
          <p className="text-[16px]">No reward tokens yet</p>
        )}
      </div>
    </div>
  );
};

export default RewardsTableShare;
