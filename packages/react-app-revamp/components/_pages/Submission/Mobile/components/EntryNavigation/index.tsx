"use client";
import { FC } from "react";
import MainHeaderMobileLayout from "@components/Header/MainHeader/MobileLayout";
import useNavigateProposals from "@components/_pages/Submission/hooks/useNavigateProposals";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";
import Link from "next/link";

interface SubmissionPageMobileEntryNavigationProps {
  isInPwaMode: boolean;
}

const SubmissionPageMobileEntryNavigation: FC<SubmissionPageMobileEntryNavigationProps> = ({ isInPwaMode }) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { currentIndex, totalProposals, previousEntryUrl, nextEntryUrl } = useNavigateProposals();

  const showNavigation = totalProposals > 1;

  return (
    <>
      {showNavigation && (
        <div
          className={`fixed ${
            isInPwaMode ? "bottom-[88px]" : "bottom-12"
          } left-0 right-0 flex ${
            currentIndex === 0 || currentIndex === totalProposals - 1 ? "justify-center" : "justify-between"
          } px-8 pt-4 pb-8 z-50 border-t-neutral-2 border-t-2 bg-true-black`}
        >
          {previousEntryUrl && currentIndex !== 0 && (
            <Link
              href={previousEntryUrl}
              scroll={false}
              className="flex items-center justify-center gap-2 text-positive-11 text-[16px] font-bold transform transition-transform duration-200 active:scale-95"
            >
              <img
                src="/contest/previous-entry-mobile.svg"
                alt="prev-entry"
                width={16}
                height={16}
                className="mt-1"
              />
              previous entry
            </Link>
          )}
          {nextEntryUrl && currentIndex !== totalProposals - 1 && (
            <Link
              href={nextEntryUrl}
              scroll={false}
              className="flex items-center justify-center gap-2 text-positive-11 text-[16px] font-bold transform transition-transform duration-200 active:scale-95"
            >
              next entry
              <img src="/contest/next-entry-mobile.svg" alt="next-entry" width={16} height={16} className="mt-1" />
            </Link>
          )}
        </div>
      )}
      <MainHeaderMobileLayout
        isConnected={isConnected}
        address={contestConfig.address}
        openConnectModal={openConnectModal}
      />
    </>
  );
};

export default SubmissionPageMobileEntryNavigation;

