"use client";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { ContestWrapper } from "@hooks/useContest/store";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { UserWrapper } from "@hooks/useUser/store";
import LayoutViewContest from "@layouts/LayoutViewContest";
import React from "react";

const ContestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ContestWrapper>
      <ProposalWrapper>
        <DeleteProposalWrapper>
          <UserWrapper>
            <CastVotesWrapper>
              <LayoutViewContest>{children}</LayoutViewContest>
            </CastVotesWrapper>
          </UserWrapper>
        </DeleteProposalWrapper>
      </ProposalWrapper>
    </ContestWrapper>
  );
};

export default ContestLayout;
