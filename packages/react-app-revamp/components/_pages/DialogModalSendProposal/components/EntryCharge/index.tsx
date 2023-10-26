import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useContestStore } from "@hooks/useContest/store";
import Image from "next/image";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";

const DialogModalSendProposalEntryChargeLayout = () => {
  const router = useRouter();
  const { address } = useAccount();
  const asPath = router.asPath;
  const { chainName } = extractPathSegments(asPath);
  const { entryCharge } = useContestStore(state => state);

  const { data, isError, isLoading } = useBalance({
    address: address as `0x${string}`,
  });
  const chainUnitLabel = chains.find(c => c.name === chainName)?.nativeCurrency.symbol;

  if (!entryCharge || !entryCharge.costToPropose) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-8 items-center">
          <p className="text-[16px] text-neutral-9 font-bold uppercase">entry charge</p>
          <p className="text-[16px] text-neutral-9">
            {formatEther(BigInt(entryCharge.costToPropose))} <span className="uppercase">{chainUnitLabel}</span> (+gas)
          </p>
        </div>
        <ul className="flex flex-col gap-2 pl-2 list-disc list-inside list-entry-charge">
          {entryCharge.percentageToCreator > 0 ? (
            <>
              <li className="text-[16px] text-neutral-9">creator comission</li>
              <li className="text-[16px] text-neutral-9">jk labs comission</li>
            </>
          ) : (
            <li className="text-[16px] text-neutral-9">jk labs comission</li>
          )}
        </ul>
      </div>
      {isLoading ? (
        <Skeleton height={16} width={200} />
      ) : (
        <div className="flex gap-8">
          <div className="flex gap-3">
            <Image src="/contest/wallet-entry.svg" height={20} width={22} alt="wallet" />
            <p className="text-[16px] text-neutral-9 font-bold">{shortenEthereumAddress(address ?? "")}</p>
          </div>

          <p className="text-[16px] text-neutral-9 ml-8">
            {data?.formatted.substring(0, 6)} <span className="uppercase">{data?.symbol}</span> available
          </p>
        </div>
      )}
    </div>
  );
};

export default DialogModalSendProposalEntryChargeLayout;
