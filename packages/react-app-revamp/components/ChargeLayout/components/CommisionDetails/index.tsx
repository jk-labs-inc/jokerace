import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { SplitFeeDestination, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC } from "react";

interface ChargeLayoutCommisionDetailsProps {
  splitFeeDestination: SplitFeeDestination;
  commisionValue: string;
  nativeCurrencyLabel: string;
  blockExplorerUrl?: string;
}

const ChargeLayoutCommisionDetails: FC<ChargeLayoutCommisionDetailsProps> = ({
  splitFeeDestination,
  commisionValue,
  nativeCurrencyLabel,
  blockExplorerUrl,
}) => {
  const blockExplorerAddressUrl = blockExplorerUrl ? `${blockExplorerUrl}/address/${splitFeeDestination.address}` : "";

  if (splitFeeDestination.type === SplitFeeDestinationType.NoSplit) {
    return (
      <ul className="flex flex-col gap-2 pl-2 mt-2 list-bullet-points animate-appear">
        <div className="flex items-center">
          <li className="text-[16px] text-neutral-9">jokerace commission</li>
          <p className="text-[16px] text-neutral-9 ml-auto">
            {commisionValue} {nativeCurrencyLabel}
          </p>
        </div>
      </ul>
    );
  }

  if (splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet) {
    return (
      <ul className="flex flex-col gap-2 pl-2 mt-2 list-bullet-points animate-appear">
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
  }

  return (
    <ul className="flex flex-col gap-2 pl-2 mt-2 list-bullet-points animate-appear">
      <>
        <div className="flex items-center">
          <li className="text-[16px] text-neutral-9">
            <a
              className="underline cursor-pointer hover:text-positive-11 transition-colors duration-300"
              target="_blank"
              href={blockExplorerAddressUrl}
            >
              {shortenEthereumAddress(splitFeeDestination.address ?? "")}
            </a>{" "}
            commission
          </li>
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
