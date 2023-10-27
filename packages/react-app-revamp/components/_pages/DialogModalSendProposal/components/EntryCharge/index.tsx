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
  const [isEntryChargeDetailsOpen, setIsEntryChargeDetailsOpen] = useState(true);
  const chainUnitLabel = chains.find(c => c.name === chainName)?.nativeCurrency.symbol;
  const insufficientBalance = accountData.value < entryCharge.costToPropose;

  return (
    <div className="flex flex-col gap-4">
      <div className={`flex flex-col`}>
        <div className="flex gap-8 items-center">
          <p className="text-[16px] text-neutral-9 font-bold uppercase">entry charge</p>
          <div className="flex gap-2 items-center">
            <p className="text-[16px] text-neutral-9">
              {formatEther(BigInt(entryCharge.costToPropose))} <span className="uppercase">{chainUnitLabel}</span>{" "}
              (+gas)
            </p>
            <button
              onClick={() => setIsEntryChargeDetailsOpen(!isEntryChargeDetailsOpen)}
              className={`transition-transform duration-500 ease-in-out transform ${
                isEntryChargeDetailsOpen ? "" : "rotate-180"
              }`}
            >
              <ChevronUpIcon height={20} className="text-neutral-9" />
            </button>
          </div>
        </div>
        <Collapsible isOpen={isEntryChargeDetailsOpen}>
          <ul className="flex flex-col gap-2 pl-2 list-disc list-inside list-entry-charge mt-2">
            {entryCharge.percentageToCreator > 0 ? (
              <>
                <li className="text-[16px] text-neutral-9">creator commission 50%</li>
                <li className="text-[16px] text-neutral-9">jk labs commission 50%</li>
              </>
            ) : (
              <li className="text-[16px] text-neutral-9">jk labs commission 100%</li>
            )}
          </ul>
        </Collapsible>
      </div>
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

        <p className={`text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-9"} ml-8`}>
          {accountData.formatted.substring(0, 6)} <span className="uppercase">{accountData.symbol}</span> available
        </p>
      </div>
    </div>
  );
};

export default DialogModalSendProposalEntryChargeLayout;
