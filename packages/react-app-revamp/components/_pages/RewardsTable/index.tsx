import Loader from "@components/UI/Loader";
import { chains } from "@config/wagmi";
import { ordinalSuffix } from "@helpers/ordinalSuffix";
import { useRouter } from "next/router";
import { FC } from "react";
import { useContractRead } from "wagmi";

interface RewardsTableShareProps {
  payee: any;
  erc20Tokens: Array<string>;
  contractRewardsModuleAddress: string;
  abiRewardsModule: any;
  chainId: number;
  totalShares: number;
}

export const RewardsTableShare: FC<RewardsTableShareProps> = ({ ...props }) => {
  const { payee, erc20Tokens, contractRewardsModuleAddress, abiRewardsModule, totalShares } = props;
  const { asPath } = useRouter();
  const { data, isError, isLoading } = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    chainId: chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id,
    functionName: "shares",
    args: payee,
  });

  return (
    <>
      {isLoading && !data ? (
        <Loader scale="component">Loading rewards data for rank {`${payee}`}...</Loader>
      ) : (
        <>
          {isError && "Something went wrong, please reload the page."}
          {data && (
            <div className="flex flex-col gap-4 w-[277px]">
              <div className="flex justify-between items-end text-[16px] font-bold border-b border-neutral-10 pb-3">
                <p>{ordinalSuffix(parseFloat(payee))} place</p>
                <p>{(data.toNumber() * 100) / totalShares}% of rewards</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RewardsTableShare;
