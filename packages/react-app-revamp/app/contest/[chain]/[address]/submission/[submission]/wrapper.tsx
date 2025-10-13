"use client";
import SubmissionPage from "@components/_pages/Submission";
import SubmissionLoader from "@components/_pages/Submission/components/Loader";
import { SubmissionPageStoreProvider } from "@components/_pages/Submission/store";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { useAllProposalIds } from "@hooks/useAllProposalIds";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { ContestConfigStoreProvider } from "@hooks/useContestConfig/store";
import { useContestDetails } from "@hooks/useContestDetails";
import { useContestVoteTimings } from "@hooks/useContestVoteTimings";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { ProposalIdStoreProvider } from "@hooks/useProposalId/store";
import { useProposalStaticData } from "@hooks/useProposalStaticData";
import { notFound } from "next/navigation";
import { FC } from "react";
import { Abi } from "viem";

interface SubmissionWrapperProps {
  address: string;
  chain: string;
  submission: string;
  abi: Abi;
  version: string;
  chainId: number;
}

const SubmissionWrapper: FC<SubmissionWrapperProps> = ({ address, chain, submission, abi, version, chainId }) => {
  const { proposalStaticData, isLoading: isLoadingProposal } = useProposalStaticData({
    address: address as `0x${string}`,
    proposalId: submission,
    chainId,
    abi,
  });

  const { voteTimings, isLoading: isLoadingTimings } = useContestVoteTimings({
    address: address as `0x${string}`,
    chainId,
    abi,
  });

  const { allProposalIds, isLoading: isLoadingIds } = useAllProposalIds({
    address: address as `0x${string}`,
    chainId,
    abi,
    version,
  });

  const { contestDetails, isLoading: isLoadingDetails } = useContestDetails({
    address: address as `0x${string}`,
    chainId,
    abi,
  });

  const isLoading = isLoadingProposal || isLoadingTimings || isLoadingIds || isLoadingDetails;

  if (!isLoading && (!proposalStaticData || !proposalStaticData.exists)) {
    return notFound();
  }

  if (isLoading) {
    return <SubmissionLoader />;
  }

  const contestConfig = {
    address: address as `0x${string}`,
    chainName: chain,
    chainId,
    chainNativeCurrencySymbol: getNativeTokenSymbol(chain) ?? "",
    abi,
    version,
  };

  return (
    <ProposalWrapper>
      <DeleteProposalWrapper>
        <CastVotesWrapper>
          <ContestConfigStoreProvider contestConfig={contestConfig}>
            <ProposalIdStoreProvider proposalId={submission}>
              <SubmissionPageStoreProvider
                proposalStaticData={proposalStaticData}
                contestDetails={contestDetails ?? { author: null, name: null, state: null }}
                allProposalIds={allProposalIds}
                voteTimings={voteTimings}
              >
                <SubmissionPage />
              </SubmissionPageStoreProvider>
            </ProposalIdStoreProvider>
          </ContestConfigStoreProvider>
        </CastVotesWrapper>
      </DeleteProposalWrapper>
    </ProposalWrapper>
  );
};

export default SubmissionWrapper;
