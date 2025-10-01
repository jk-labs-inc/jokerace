import { ListProposalVotes } from "@components/_pages/ListProposalVotes";
import GradientText from "@components/UI/GradientText";
import useContestConfigStore from "@hooks/useContestConfig/store";
import Image from "next/image";
import { FC } from "react";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton from "./components/LoadingSkeleton";

interface SubmissionPageDesktopVotingAreaWidgetVotersProps {
  proposalId: string;
  isVotingOpen: boolean;
}

const SubmissionPageDesktopVotingAreaWidgetVoters: FC<SubmissionPageDesktopVotingAreaWidgetVotersProps> = ({
  proposalId,
  isVotingOpen,
}) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const {
    data: addressesVoted,
    isLoading: isLoadingAddressesVoted,
    isError: isErrorAddressesVoted,
  } = useReadContract({
    address: contestConfig.address as `0x${string}`,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    functionName: "proposalAddressesHaveVoted",
    args: [proposalId],
    query: {
      enabled: !!contestConfig.address && !!contestConfig.abi && !!contestConfig.chainId && !!proposalId,
    },
  });

  if (isLoadingAddressesVoted) {
    return <SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton />;
  }

  if (isErrorAddressesVoted) {
    return <div>Error loading addresses voted</div>;
  }

  // TODO: check types
  if (!addressesVoted || (Array.isArray(addressesVoted) && addressesVoted.length === 0)) {
    return null;
  }

  const votedAddressesArray = addressesVoted as string[];

  return (
    <div className="w-full flex-1 min-h-0">
      <div className="bg-gradient-voting-area-purple rounded-4xl pl-8 pr-12 py-4 w-full h-full flex flex-col">
        <div className="flex flex-col gap-6 min-h-0 flex-1">
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <Image src="/entry/vote-ballot.svg" alt="voters" width={24} height={24} className="self-center" />
            <GradientText isFontSabo={false} textSizeClassName="text-[24px] font-bold">
              voters
            </GradientText>
            <p className="text-[16px] text-neutral-11 font-bold">
              {votedAddressesArray.length > 0 ? `(${votedAddressesArray.length})` : ""}
            </p>
          </div>

          <ListProposalVotes proposalId={proposalId} votedAddresses={votedAddressesArray} className="text-neutral-11" />
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetVoters;
