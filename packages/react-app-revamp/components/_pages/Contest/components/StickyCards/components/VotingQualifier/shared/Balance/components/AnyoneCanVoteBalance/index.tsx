import { useUserStore } from "@hooks/useUser/store";
import { useUserNativeBalance } from "@hooks/useUserBalance";
import { useShallow } from "zustand/react/shallow";
import { FC, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import OnrampModal from "@components/Onramp/components/Modal";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";

const BalanceOrSkeleton = ({
  isUserBalanceLoading,
  userBalance,
  nativeCurrencySymbol,
}: {
  isUserBalanceLoading: boolean;
  userBalance?: string | number;
  nativeCurrencySymbol?: string;
}) => {
  return isUserBalanceLoading ? (
    <span className="flex items-center gap-1 text-neutral-9">
      <Skeleton
        width={100}
        height={16}
        baseColor="#242424"
        highlightColor="#78FFC6"
        duration={1}
        style={{ lineHeight: "normal", fontSize: "inherit", verticalAlign: "middle" }}
      />
      =
    </span>
  ) : (
    <span className="text-neutral-9">
      {userBalance} {nativeCurrencySymbol} =
    </span>
  );
};

interface VotingQualifierAnyoneCanVoteBalanceProps {
  userAddress: `0x${string}`;
}

const VotingQualifierAnyoneCanVoteBalance: FC<VotingQualifierAnyoneCanVoteBalanceProps> = ({ userAddress }) => {
  const { contestChainId, contestChainNativeCurrencySymbol, contestChainName } = useContestStore(
    useShallow(state => state.contestInfoData),
  );
  const { data, isLoading, error } = useUserNativeBalance({ address: userAddress, chainId: contestChainId });
  const currentUserAvailableVotesAmount = useUserStore(useShallow(state => state.currentUserAvailableVotesAmount));
  const [isOnrampOpen, setIsOnrampOpen] = useState(false);

  // add error handling for native balance
  if (error) return <p className="text-[16px] md:text-[24px] text-secondary-11 font-bold">error</p>;

  if (currentUserAvailableVotesAmount === 0) {
    return (
      <>
        <OnrampModal
          chain={contestChainName}
          asset={contestChainNativeCurrencySymbol}
          isOpen={isOnrampOpen}
          onClose={() => setIsOnrampOpen(false)}
        />
        <ButtonV3
          size={ButtonSize.DEFAULT_LONG}
          colorClass="bg-true-black border border-neutral-11 rounded-[40px] hover:bg-neutral-11 hover:text-true-black transition-all duration-300"
          textColorClass="text-neutral-11"
          onClick={() => setIsOnrampOpen(true)}
        >
          add funds
        </ButtonV3>
      </>
    );
  }

  return (
    <p className="text-[16px] md:text-[24px] font-bold flex items-center">
      <BalanceOrSkeleton
        isUserBalanceLoading={isLoading}
        userBalance={data}
        nativeCurrencySymbol={contestChainNativeCurrencySymbol}
      />
      <span className="text-neutral-11 ml-1">
        {formatNumberAbbreviated(currentUserAvailableVotesAmount)} vote
        {currentUserAvailableVotesAmount === 1 ? "" : "s"}
      </span>
    </p>
  );
};

export default VotingQualifierAnyoneCanVoteBalance;
