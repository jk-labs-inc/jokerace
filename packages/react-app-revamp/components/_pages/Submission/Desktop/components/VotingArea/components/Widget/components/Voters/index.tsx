import { ListProposalVotes } from "@components/_pages/ListProposalVotes";
import GradientText from "@components/UI/GradientText";
import useContestConfigStore from "@hooks/useContestConfig/store";
import Image from "next/image";
import { FC } from "react";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton from "./components/LoadingSkeleton";
import NoVotersPlaceholder from "./components/NoVotersPlaceholder";
import { useAddressesVoted } from "./hooks/useAddressesVoted";

interface SubmissionPageDesktopVotingAreaWidgetVotersProps {
  proposalId: string;
  isVotingOpen: boolean;
  onRefetchReady?: (refetch: () => void) => void;
}

const SubmissionPageDesktopVotingAreaWidgetVoters: FC<SubmissionPageDesktopVotingAreaWidgetVotersProps> = ({
  proposalId,
  isVotingOpen,
}) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { addressesVoted, isLoadingAddressesVoted, isErrorAddressesVoted } = useAddressesVoted({
    contestAddress: contestConfig.address,
    contestAbi: contestConfig.abi,
    contestChainId: contestConfig.chainId,
    proposalId,
  });

  if (isLoadingAddressesVoted) {
    return <SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton />;
  }

  //TODO: add error design
  if (isErrorAddressesVoted) {
    return <div>Error loading addresses voted</div>;
  }

  const votedAddressesArray = addressesVoted as string[];
  const hasNoVoters = votedAddressesArray.length === 0;
  const shouldShowPlaceholder = hasNoVoters && isVotingOpen;

  return (
    <div className="w-full flex-1 min-h-0">
      <div className="bg-gradient-voting-area-purple rounded-4xl pl-8 pr-12 py-4 w-full h-full flex flex-col">
        <div className="flex flex-col gap-6 min-h-0 flex-1">
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <Image src="/entry/vote-ballot.svg" alt="voters" width={24} height={24} className="self-center" />
            <GradientText isFontSabo={false} textSizeClassName="text-[24px] font-bold">
              voters
            </GradientText>
            <p className="text-[16px] text-neutral-11 font-bold">{`(${votedAddressesArray.length})`}</p>
          </div>

          {shouldShowPlaceholder ? (
            <NoVotersPlaceholder />
          ) : (
            <ListProposalVotes
              proposalId={proposalId}
              votedAddresses={votedAddressesArray}
              className="text-neutral-11"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetVoters;
