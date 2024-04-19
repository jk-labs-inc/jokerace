import { formatBalance } from "@helpers/formatBalance";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { VoteType } from "@hooks/useDeployContest/types";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface ChargeLayoutVoteProps {
  chargeType: VoteType;
  userAddress: string;
  balance: string;
  nativeCurrencySymbol: string;
  entryChargeFormatted: string;
  insufficientBalance: boolean;
  amountOfVotes?: number;
}

const ChargeLayoutVote: FC<ChargeLayoutVoteProps> = ({
  chargeType,
  userAddress,
  balance,
  nativeCurrencySymbol,
  entryChargeFormatted,
  insufficientBalance,
  amountOfVotes,
}) => {
  const chargeLabel = chargeType === VoteType.PerVote ? "charge for vote" : "vote charge";
  const isPerVote = chargeType === VoteType.PerVote;
  const [totalCharge, setTotalCharge] = useState("0");

  useEffect(() => {
    if (!amountOfVotes) {
      setTotalCharge("0");
      return;
    }

    if (isPerVote) {
      const chargeAmount = parseFloat(entryChargeFormatted);
      const multipliedCharge = chargeAmount * amountOfVotes ?? 1;
      const charge = +multipliedCharge.toFixed(6);

      setTotalCharge(charge.toString());
    }
  }, [amountOfVotes, entryChargeFormatted, isPerVote]);

  return (
    <div className="flex flex-col gap-2 w-full md:min-w-60">
      <div className="flex flex-col">
        <div
          className={`flex justify-between ${insufficientBalance ? "text-negative-11" : "text-neutral-9 hover:text-positive-11"}  transition-colors duration-300`}
        >
          <div className="flex flex-col">
            <div className="flex gap-3 ">
              <Image
                src={`${insufficientBalance ? "/contest/wallet-entry-insufficient.svg" : "/contest/wallet-entry.svg"}`}
                height={20}
                width={22}
                alt="wallet"
              />
              <p className={`text-[16px] `}>{shortenEthereumAddress(userAddress ?? "")}</p>
            </div>
          </div>

          <p className={`text-[16px] `}>
            {formatBalance(balance)} {nativeCurrencySymbol}
          </p>
        </div>
        <div className="flex justify-between text-neutral-9 text-[16px] hover:text-positive-11 transition-colors duration-300">
          <p>{chargeLabel}</p>
          <p>
            {entryChargeFormatted} {nativeCurrencySymbol}
          </p>
        </div>
      </div>

      {isPerVote ? (
        <div className="flex justify-between text-neutral-11 text-[16px] hover:text-positive-11 transition-colors duration-300">
          <p>total charge</p>
          <p>
            {totalCharge} {nativeCurrencySymbol}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ChargeLayoutVote;
