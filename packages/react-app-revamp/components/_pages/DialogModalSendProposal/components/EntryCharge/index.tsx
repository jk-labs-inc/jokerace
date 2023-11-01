import Collapsible from "@components/UI/Collapsible";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { EntryCharge } from "@hooks/useDeployContest/types";
import { FetchBalanceResult } from "@wagmi/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

interface DialogModalSendProposalEntryChargeLayoutProps {
  entryCharge: EntryCharge;
  accountData: FetchBalanceResult;
}

const DialogModalSendProposalEntryChargeLayout: FC<DialogModalSendProposalEntryChargeLayoutProps> = ({
  entryCharge,
  accountData,
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const asPath = router.asPath;
  const { chainName } = extractPathSegments(asPath);
  const [isEntryChargeDetailsOpen, setIsEntryChargeDetailsOpen] = useState(false);
  const chainUnitLabel = chains.find(c => c.name === chainName)?.nativeCurrency.symbol;
  const insufficientBalance = accountData.value < entryCharge.costToPropose;
  const entryChargeFormatted = formatEther(BigInt(entryCharge.costToPropose));
  const entryChargeHalfFormatted = formatEther(BigInt(entryCharge.costToPropose / 2));
  const commissionValue = entryCharge.percentageToCreator > 0 ? entryChargeHalfFormatted : entryChargeFormatted;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <div className="flex gap-3">
            <Image
              src={`${insufficientBalance ? "/contest/wallet-entry-insufficient.svg" : "/contest/wallet-entry.svg"}`}
              height={20}
              width={22}
              alt="wallet"
            />
            <p className={`text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-9"}  font-bold`}>
              {shortenEthereumAddress(address ?? "")}
            </p>
          </div>
          {insufficientBalance ? <p className="text-negative-11 text-[16px]">insufficient funds</p> : null}
        </div>

        <p className={`text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-9"} ml-8 font-bold`}>
          {accountData.formatted.substring(0, 7)} <span className="uppercase">{accountData.symbol}</span> available
        </p>
      </div>
      <div className={`flex flex-col`}>
        <div className="flex gap-16 items-center">
          <div className="flex gap-2">
            <p className="text-[16px] text-neutral-9">entry charge</p>
            <button
              onClick={() => setIsEntryChargeDetailsOpen(!isEntryChargeDetailsOpen)}
              className={`transition-transform duration-500 ease-in-out transform ${
                isEntryChargeDetailsOpen ? "" : "rotate-180"
              }`}
            >
              <ChevronUpIcon height={20} className="text-neutral-9" />
            </button>
          </div>

          <p className="text-[16px] text-neutral-9">
            {entryChargeFormatted} <span className="uppercase">{chainUnitLabel}</span> (+gas)
          </p>
        </div>
        <Collapsible isOpen={isEntryChargeDetailsOpen}>
          <ul className="flex flex-col gap-2 pl-2 mt-2 list-bullet-points">
            {entryCharge.percentageToCreator > 0 ? (
              <>
                <div className="flex gap-12 items-center">
                  <li className="text-[16px] text-neutral-9">creator commission</li>
                  <p className="text-[16px] text-neutral-9">
                    {commissionValue} <span className="uppercase">{chainUnitLabel}</span>
                  </p>
                </div>
                <div className="flex gap-10 items-center">
                  <li className="text-[16px] text-neutral-9">jokerace commission</li>
                  <p className="text-[16px] text-neutral-9">
                    {commissionValue} <span className="uppercase">{chainUnitLabel}</span>
                  </p>
                </div>
              </>
            ) : (
              <div className="flex gap-12 items-center">
                <li className="text-[16px] text-neutral-9">jokerace commission</li>
                <p className="text-[16px] text-neutral-9">
                  {commissionValue} <span className="uppercase">{chainUnitLabel}</span>
                </p>
              </div>
            )}
          </ul>
        </Collapsible>
      </div>
    </div>
  );
};

export default DialogModalSendProposalEntryChargeLayout;
