"use client";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { ContestWrapper } from "@hooks/useContest/store";
import { ContestConfigStoreProvider } from "@hooks/useContestConfig/store";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { UserWrapper } from "@hooks/useUser/store";
import LayoutViewContest from "@layouts/LayoutViewContest";
import { FC } from "react";
import { Abi } from "viem";

interface ContestProps {
  address: string;
  chain: string;
  chainId: number;
  abi: Abi;
  version: string;
}

const Contest: FC<ContestProps> = ({ address, chain, chainId, abi, version }) => {
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
                <LayoutViewContest />
              </ContestConfigStoreProvider>
            </CastVotesWrapper>
          </UserWrapper>
        </DeleteProposalWrapper>
      </ProposalWrapper>
    </ContestWrapper>
  );
};

export default Contest;
