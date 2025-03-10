/* eslint-disable react/no-unescaped-entities */
import { LINK_BRIDGE_DOCS } from "@config/links";
import { chains } from "@config/wagmi";
import { formatBalance } from "@helpers/formatBalance";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { formatEther } from "viem";
import { useBalance } from "wagmi";

interface VotingQualifierMessageProps {
  currentUserTotalVotesAmount: number;
  currentUserAvailableVotesAmount: number;
  contestStatus: ContestStatus;
  isMobile: boolean;
  isReadOnly: boolean;
  anyoneCanVote?: boolean;
  userAddress?: string;
  chainId?: number;
  nativeCurrencySymbol?: string;
}

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

const VotingQualifierMessage: FC<VotingQualifierMessageProps> = ({
  currentUserTotalVotesAmount,
  currentUserAvailableVotesAmount,
  contestStatus,
  isMobile,
  isReadOnly,
  anyoneCanVote,
  userAddress,
  chainId,
  nativeCurrencySymbol,
}) => {
  const canVote = currentUserAvailableVotesAmount > 0;
  const votingOpen = contestStatus === ContestStatus.VotingOpen;
  const outOfVotes = currentUserTotalVotesAmount > 0 && !canVote;
  const zeroVotesOnAnyoneCanVote = currentUserTotalVotesAmount === 0 && anyoneCanVote;
  const chainName = chains.find(chain => chain.id === chainId)?.name;
  const chainCurrencySymbol = chains.find(chain => chain.id === chainId)?.nativeCurrency?.symbol;
  const { data: userBalance, isLoading: isUserBalanceLoading } = useBalance({
    address: userAddress as `0x${string}`,
    chainId,
    query: {
      select(data) {
        const formattedToEther = formatEther(data.value ?? 0);

        return formatBalance(formattedToEther);
      },
      enabled: !!anyoneCanVote,
    },
  });

  if (isReadOnly) return <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">vote is in read mode</p>;

  if (canVote && anyoneCanVote) {
    return (
      <p className="text-[16px] md:text-[24px] font-bold flex items-center">
        <BalanceOrSkeleton
          isUserBalanceLoading={isUserBalanceLoading}
          userBalance={userBalance}
          nativeCurrencySymbol={nativeCurrencySymbol}
        />
        <span className="text-neutral-11 ml-1">
          {formatNumberAbbreviated(currentUserAvailableVotesAmount)} vote
          {currentUserAvailableVotesAmount === 1 ? "" : "s"}
        </span>
      </p>
    );
  }

  if (canVote && votingOpen) {
    return (
      <p className="text-[16px] md:text-[24px] text-neutral-11 font-bold">
        {formatNumberAbbreviated(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"}{" "}
        left
      </p>
    );
  }

  if (canVote) {
    return (
      <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">
        {formatNumberAbbreviated(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"}{" "}
        {isMobile ? "to use" : "to deploy"}
      </p>
    );
  }

  if (zeroVotesOnAnyoneCanVote) {
    return (
      <a
        href={LINK_BRIDGE_DOCS}
        target="_blank"
        className="text-[16px] text-positive-11 opacity-80 hover:opacity-100 transition-colors font-bold leading-loose"
      >
        add {chainCurrencySymbol} to {chainName} to get votes {">"}
      </a>
    );
  }

  if (outOfVotes) return <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">you're out of votes :(</p>;

  if (!canVote) return <p className="text-[16px] md:text-[24px] text-secondary-11 font-bold">ineligible to vote</p>;

  return null;
};

export default VotingQualifierMessage;
