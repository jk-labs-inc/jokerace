"use client";

import SubmissionPage from "@components/_pages/Submission";
import { SubmissionPageStoreProvider } from "@components/_pages/Submission/store";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { ContestWrapper } from "@hooks/useContest/store";
import { ContestConfigStoreProvider } from "@hooks/useContestConfig/store";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { ProposalIdStoreProvider } from "@hooks/useProposalId/store";
import { UserWrapper } from "@hooks/useUser/store";
import { ContestVoteTimings, ProposalStaticData } from "lib/submission";
import { FC } from "react";
import { Abi } from "viem";

interface SubmissionProps {
  address: string;
  chain: string;
  submission: string;
  abi: Abi;
  version: string;
  chainId: number;
  proposalStaticData: ProposalStaticData;
  contestDetails: {
    author: string;
    name: string;
  } | null;
  allProposalIds: string[];
  voteTimings: ContestVoteTimings | null;
}

const Submission: FC<SubmissionProps> = ({
  address,
  chain,
  submission,
  abi,
  version,
  chainId,
  proposalStaticData,
  contestDetails,
  allProposalIds,
  voteTimings,
}) => {
  const contestConfig = {
    address: address as `0x${string}`,
    chainName: chain,
    chainId,
    chainNativeCurrencySymbol: getNativeTokenSymbol(chain) ?? "",
    abi,
    version,
  };

  return (
    <ContestWrapper>
      <ProposalWrapper>
        <DeleteProposalWrapper>
          <UserWrapper>
            <CastVotesWrapper>
              <ContestConfigStoreProvider contestConfig={contestConfig}>
                <ProposalIdStoreProvider proposalId={submission}>
                  <SubmissionPageStoreProvider
                    proposalStaticData={proposalStaticData}
                    contestDetails={contestDetails ?? { author: null, name: null }}
                    allProposalIds={allProposalIds}
                    voteTimings={voteTimings}
                  >
                    <SubmissionPage />
                  </SubmissionPageStoreProvider>
                </ProposalIdStoreProvider>
              </ContestConfigStoreProvider>
            </CastVotesWrapper>
          </UserWrapper>
        </DeleteProposalWrapper>
      </ProposalWrapper>
    </ContestWrapper>
  );
};

export default Submission;
