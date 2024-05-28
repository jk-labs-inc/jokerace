import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { SplitFeeDestination, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface ChargeLayoutCommisionDetailsProps {
  splitFeeDestination: SplitFeeDestination;
  commisionValue: string;
  nativeCurrencyLabel: string;
}

const ChargeLayoutCommisionDetails: FC<ChargeLayoutCommisionDetailsProps> = ({
  splitFeeDestination,
  commisionValue,
  nativeCurrencyLabel,
}) => {
  if (splitFeeDestination.type === SplitFeeDestinationType.NoSplit) {
    return (
      <ul className="flex flex-col gap-2 pl-2 mt-2 list-bullet-points animate-reveal">
        <div className="flex items-center">
          <li className="text-[16px] text-neutral-9">jokerace commission</li>
          <p className="text-[16px] text-neutral-9 ml-auto">
            {commisionValue} {nativeCurrencyLabel}
          </p>
        </div>
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-2 pl-2 mt-2 list-bullet-points animate-reveal">
      <>
        <div className="flex items-center">
          <li className="text-[16px] text-neutral-9">creator commission</li>
          <p className="text-[16px] text-neutral-9 ml-auto">
            {commisionValue} {nativeCurrencyLabel}
          </p>
        </div>
        <div className="flex gap-10 items-center">
          <li className="text-[16px] text-neutral-9">jokerace commission</li>
          <p className="text-[16px] text-neutral-9 ml-auto">
            {commisionValue} {nativeCurrencyLabel}
          </p>
        </div>
      </>
    </ul>
  );
};

export default ChargeLayoutCommisionDetails;
