import Collapsible from "@components/UI/Collapsible";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { Charge } from "@hooks/useDeployContest/types";
import { GetBalanceReturnType } from "@wagmi/core";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import ChargeLayoutCommisionDetails from "../CommisionDetails";

interface ChargeLayoutSubmissionProps {
  charge: Charge;
  accountData: GetBalanceReturnType;
}

const ChargeLayoutSubmission: FC<ChargeLayoutSubmissionProps> = ({ charge, accountData }) => {
  const [isEntryChargeDetailsOpen, setIsEntryChargeDetailsOpen] = useState(false);
  const { address } = useAccount();
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const chainUnitLabel = chains.find((c: { name: string }) => c.name.toLowerCase() === chainName.toLowerCase())
    ?.nativeCurrency.symbol;
  const chargeAmount = charge.type.costToPropose;
  const insufficientBalance = accountData.value < chargeAmount;
  const entryChargeFormatted = formatEther(BigInt(chargeAmount));
  const entryChargeHalfFormatted = formatEther(BigInt(chargeAmount / 2));
  const commissionValue = charge.percentageToCreator > 0 ? entryChargeHalfFormatted : entryChargeFormatted;
  const accountBalance = formatEther(accountData.value);

  return (
    <div className="flex flex-col gap-2 w-full md:w-[344px]">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <div className="flex gap-3">
            <Image
              src={insufficientBalance ? "/contest/wallet-entry-insufficient.svg" : "/contest/wallet-entry.svg"}
              height={20}
              width={22}
              alt="wallet"
            />
            <p className={`text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-9"} font-bold`}>
              {shortenEthereumAddress(address ?? "")}
            </p>
          </div>
          {insufficientBalance && <p className="text-negative-11 text-[16px]">insufficient funds</p>}
        </div>
        <p className={`text-[16px] ${insufficientBalance ? "text-negative-11" : "text-neutral-9"} ml-auto font-bold`}>
          {formatBalance(accountBalance)} {accountData.symbol} available
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => setIsEntryChargeDetailsOpen(!isEntryChargeDetailsOpen)}
          >
            <p className="text-[16px] text-neutral-9">entry charge</p>
            <button
              className={`transition-transform duration-500 ease-in-out transform ${
                isEntryChargeDetailsOpen ? "" : "rotate-180"
              }`}
            >
              <ChevronUpIcon height={20} className="text-neutral-9" />
            </button>
          </div>
          <p className="text-[16px] text-neutral-9 ml-auto">
            {entryChargeFormatted} {chainUnitLabel} (+gas)
          </p>
        </div>
        <Collapsible isOpen={isEntryChargeDetailsOpen}>
          <ChargeLayoutCommisionDetails
            splitFeeDestination={charge.splitFeeDestination}
            commisionValue={commissionValue}
            nativeCurrencyLabel={chainUnitLabel ?? ""}
          />
        </Collapsible>
      </div>
    </div>
  );
};

export default ChargeLayoutSubmission;
