import { useChainChange } from "@hooks/useChainChange";
import useChargeDetails from "@hooks/useChargeDetails";
import { Charge, PriceCurve, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import CreateContestConfirmLayout from "../Layout";
import CostToEnterMessage from "./components/CostToEnter";
import CostToVoteMessage from "./components/CostToVote";
import CreatorChargesMessage from "./components/CreatorCharges";
import SplitMessage from "./components/Split";

interface CreateContestConfirmMonetizationProps {
  charge: Charge;
  priceCurve: PriceCurve;
  step: number;
  onClick?: (stepIndex: number) => void;
}

const CreateContestConfirmMonetization: FC<CreateContestConfirmMonetizationProps> = ({
  charge,
  priceCurve,
  step,
  onClick,
}) => {
  const { chain, address } = useAccount();
  const chainChanged = useChainChange();
  const { type, splitFeeDestination, voteType } = charge;
  const { isError, refetch: refetchChargeDetails, isLoading } = useChargeDetails(chain?.name.toLowerCase() ?? "");
  const [isHovered, setIsHovered] = useState(false);
  const nativeCurrencySymbol = chain?.nativeCurrency.symbol;
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [highlightChainChange, setHighlightChainChange] = useState(false);
  const blockExplorerUrl = chain?.blockExplorers?.default.url;
  const blockExplorerAddressUrl = blockExplorerUrl
    ? `${blockExplorerUrl}/address/${
        splitFeeDestination.type === SplitFeeDestinationType.CreatorWallet ? address : splitFeeDestination.address
      }`
    : "";

  useEffect(() => {
    if (chainChanged) {
      setHighlightChainChange(true);
      const timer = setTimeout(() => setHighlightChainChange(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [chainChanged]);

  if (isError) {
    return (
      <CreateContestConfirmLayout onClick={() => refetchChargeDetails()} onHover={value => setIsHovered(value)}>
        <div className={`flex flex-col gap-4 ${isHovered || isMobileOrTablet ? "text-neutral-11" : "text-neutral-14"}`}>
          <p className="text-[16px] text-negative-11 font-bold">
            ruh roh, we couldn't load charge details for this chain!{" "}
            <button className="underline cursor-pointer" onClick={() => refetchChargeDetails()}>
              please try again
            </button>
          </p>
        </div>
      </CreateContestConfirmLayout>
    );
  }

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <div
        className={`flex flex-col gap-2 ${
          highlightChainChange && !isLoading ? "text-negative-11 animate-pulse" : "text-neutral-11"
        } transition-all duration-300`}
      >
        <p className="text-neutral-9 text-[12px] font-bold uppercase">monetization</p>
        {isLoading ? (
          <p className="loadingDots font-sabo-filled text-[14px] text-neutral-14">loading charge fees</p>
        ) : (
          <ul className="flex flex-col pl-6 list-disc">
            <CostToEnterMessage costToPropose={type.costToPropose} nativeCurrencySymbol={nativeCurrencySymbol} />
            <CostToVoteMessage
              costToVote={type.costToVote}
              costToVoteStartPrice={type.costToVoteStartPrice}
              costToVoteEndPrice={type.costToVoteEndPrice}
              priceCurve={priceCurve}
              nativeCurrencySymbol={nativeCurrencySymbol}
              voteType={voteType}
            />
            <SplitMessage splitFeeDestinationType={splitFeeDestination.type} />
            <CreatorChargesMessage
              splitFeeDestinationType={splitFeeDestination.type}
              splitFeeDestinationAddress={splitFeeDestination.address}
              creatorAddress={address}
              blockExplorerAddressUrl={blockExplorerAddressUrl}
            />
          </ul>
        )}
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmMonetization;
