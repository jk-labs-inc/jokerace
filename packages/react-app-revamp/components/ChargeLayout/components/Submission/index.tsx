import { formatBalance } from "@helpers/formatBalance";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { Charge } from "@hooks/useDeployContest/types";
import { GetBalanceReturnType } from "@wagmi/core";
import { FC } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

interface ChargeLayoutSubmissionProps {
  charge: Charge;
  accountData: GetBalanceReturnType;
}

const ChargeLayoutSubmission: FC<ChargeLayoutSubmissionProps> = ({ charge, accountData }) => {
  const chainUnitLabel = useContestConfigStore(useShallow(state => state.contestConfig.chainNativeCurrencySymbol));
  const chargeAmount = charge.type.costToPropose;
  const insufficientBalance = accountData.value < chargeAmount;
  const entryChargeFormatted = formatEther(BigInt(chargeAmount));
  const accountBalance = formatEther(accountData.value);

  return (
    <div className="flex flex-col gap-2 w-full md:w-[320px]">
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
