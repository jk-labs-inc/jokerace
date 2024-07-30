/* eslint-disable react/no-unescaped-entities */
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import VotingQualifierMessage from "./components/VotingQualifierMessage";

const VotingContestQualifier = () => {
  const { anyoneCanVote, charge } = useContestStore(state => state);
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const {
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
    isCurrentUserVoteQualificationLoading,
    isCurrentUserVoteQualificationError,
  } = useUserStore(state => state);
  const { contestStatus } = useContestStatusStore(state => state);
  const isReadOnly = useContestStore(state => state.isReadOnly);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const costToVoteFormatted = formatEther(BigInt(charge?.type.costToVote ?? 0));
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const nativeCurrencySymbol = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())
    ?.nativeCurrency.symbol;
  const chainId = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.id;

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4  md:pl-8">
      <div className="flex items-center gap-2">
        <Image src="/contest/ballot.svg" width={16} height={16} alt="timer" />
        {anyoneCanVote ? (
          <div className="flex items-center gap-2">
            <p className="text-[12px] md:text-[16px] uppercase text-neutral-9">my wallet</p>
            <span className="hidden md:flex text-[16px] text-neutral-9">|</span>
            <p className="hidden md:flex text-[16px] text-neutral-9">
              1 vote = {costToVoteFormatted} {nativeCurrencySymbol}
            </p>
          </div>
        ) : (
          <p className="text-[12px] md:text-[16px] uppercase text-neutral-9">my votes</p>
        )}
      </div>
      {isConnected ? (
        isCurrentUserVoteQualificationLoading ? (
          <Skeleton
            height={isMobile ? 16 : 24}
            width={isMobile ? 100 : 300}
            baseColor="#706f78"
            highlightColor="#FFE25B"
            duration={1}
          />
        ) : isCurrentUserVoteQualificationError ? (
          <p className="text-[16px] md:text-[24px] text-negative-11 font-bold">
            ruh roh, we couldn't load your votes! please reload the page
          </p>
        ) : (
          <VotingQualifierMessage
            userAddress={address}
            chainId={chainId}
            nativeCurrencySymbol={nativeCurrencySymbol}
            currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
            currentUserTotalVotesAmount={currentUserTotalVotesAmount}
            contestStatus={contestStatus}
            isMobile={isMobile}
            isReadOnly={isReadOnly}
            anyoneCanVote={anyoneCanVote}
          />
        )
      ) : (
        <p className="text-[16px] md:text-[24px] text-positive-11 font-bold cursor-pointer" onClick={openConnectModal}>
          {isMobile ? "connect wallet to see" : "connect wallet to see votes"}
        </p>
      )}
    </div>
  );
};

export default VotingContestQualifier;
