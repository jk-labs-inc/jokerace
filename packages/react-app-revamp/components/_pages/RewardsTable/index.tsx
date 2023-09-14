import Loader from "@components/UI/Loader";
import { chains } from "@config/wagmi";
import { ordinalSuffix } from "@helpers/ordinalSuffix";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { FC } from "react";
import { useContractRead } from "wagmi";

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
  const { asPath } = useRouter();
  const { data, isError, isLoading } = useContractRead({
    address: contractRewardsModuleAddress as `0x${string}`,
    abi: abiRewardsModule,
    chainId: chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id,
    functionName: "shares",
    args: [Number(payee)],
  }) as any;

  return (
    <>
      {isLoading && !data ? (
        <Loader scale="component">Loading rewards data for rank {`${payee}`}...</Loader>
      ) : (
        <>
          {isError && "Something went wrong, please reload the page."}
          {data && (
            <div className="flex flex-col gap-4 md:w-[277px]">
              <div
                className={`flex justify-between items-end text-[16px] font-bold ${
                  !props.isLast ? "border-b border-neutral-10" : ""
                } pb-3`}
              >
                <p>{ordinalSuffix(parseFloat(payee))} place</p>
                <p>{BigNumber.from(data).mul(100).div(totalShares).toString()}% of rewards</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RewardsTableShare;
