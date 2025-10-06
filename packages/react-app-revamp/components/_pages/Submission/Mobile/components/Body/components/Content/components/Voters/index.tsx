import { useAddressesVoted } from "@components/_pages/Submission/Desktop/components/VotingArea/components/Widget/components/Voters/hooks/useAddressesVoted";
import SubmissionPageMobileVotersList from "@components/_pages/Submission/Mobile/components/VotersList";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import useProposalVotes from "@hooks/useProposalVotes";
import { useShallow } from "zustand/shallow";

const SubmissionPageMobileBodyContentVoters = () => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const { votes } = useProposalVotes({
    contestAddress: contestConfig.address,
    proposalId: proposalId,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
  });
  const { addressesVoted, isLoadingAddressesVoted, isErrorAddressesVoted } = useAddressesVoted({
    contestAddress: contestConfig.address,
    proposalId: proposalId,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
    enabled: !!votes && votes > 0,
  });

  if (!votes || votes === 0) return null;
  if (isLoadingAddressesVoted) return <p className="text-neutral-9 text-[16px]">loading voters...</p>;
  if (isErrorAddressesVoted) return null;

  const votedAddressesArray = (addressesVoted as string[]) ?? [];

  return <SubmissionPageMobileVotersList addressesVoted={votedAddressesArray} />;
};

export default SubmissionPageMobileBodyContentVoters;
