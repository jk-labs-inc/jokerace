import Collapsible from "@components/UI/Collapsible";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { Charge } from "@hooks/useDeployContest/types";
import { GetBalanceReturnType } from "@wagmi/core";
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
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const chainUnitLabel = chains.find((c: { name: string }) => c.name.toLowerCase() === chainName.toLowerCase())
    ?.nativeCurrency.symbol;
  const chargeAmount = charge.type.costToPropose;
  const insufficientBalance = accountData.value < chargeAmount;
  const entryChargeFormatted = formatEther(BigInt(chargeAmount));
  const accountBalance = formatEther(accountData.value);

  return (
    <div className="flex flex-col gap-4 w-full md:w-[344px]">
      <div className="flex justify-between items-center">
        <p className="text-[16px] text-neutral-9">my wallet</p>
        <p className={`text-[16px] text-neutral-9 ${insufficientBalance ? "text-negative-11" : ""}`}>
          {formatBalance(accountBalance)} {chainUnitLabel}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[16px] text-neutral-11">entry charge</p>
        <p className="text-[24px] text-neutral-11 font-bold">
          {entryChargeFormatted} {chainUnitLabel}
        </p>
      </div>
    </div>
  );
};

export default ChargeLayoutSubmission;
