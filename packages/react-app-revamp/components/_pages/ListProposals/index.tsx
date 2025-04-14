import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import ProposalContent from "@components/_pages/ProposalContent";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import useProposal, { PROPOSALS_PER_PAGE } from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAccount } from "wagmi";
import { verifyEntryPreviewPrompt } from "../DialogModalSendProposal/utils";
import ListProposalsContainer from "./container";
import ListProposalsSkeleton from "./skeleton";
import { useMediaQuery } from "react-responsive";

export const ListProposals = () => {
  const { address, chainId: userChainId } = useAccount();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const asPath = usePathname();
  const { address: contestAddress, chainName: contestChainName } = extractPathSegments(asPath);
  const contestChainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase() === contestChainName.toLowerCase(),
  )?.[0]?.id;

  const { fetchProposalsPage } = useProposal();
  const { deleteProposal, isLoading: isDeleteInProcess, isSuccess: isDeleteSuccess } = useDeleteProposal();
  const {
    listProposalsIds,
    isPageProposalsLoading,
    initialMappedProposalIds,
    currentPagePaginationProposals,
    indexPaginationProposals,
    submissionsCount,
    totalPagesPaginationProposals,
    listProposalsData,
  } = useProposalStore(state => state);
  const { contestAuthorEthereumAddress, contestAbi: abi, version } = useContestStore(state => state);

  const [deletingProposalIds, setDeletingProposalIds] = useState<string[]>([]);
  const [selectedProposalIds, setSelectedProposalIds] = useState<string[]>([]);
  const showDeleteButton = selectedProposalIds.length > 0 && !isDeleteInProcess;
  const remainingProposalsToLoad = submissionsCount - listProposalsData.length;
  const skeletonRemainingLoaderCount = Math.min(remainingProposalsToLoad, PROPOSALS_PER_PAGE);
  const isUserOnCorrectChain = contestChainId === userChainId;
  const { fields: metadataFieldsConfig } = useMetadataStore(state => state);
  const { enabledPreview } =
    metadataFieldsConfig.length > 0
      ? verifyEntryPreviewPrompt(metadataFieldsConfig[0].prompt)
      : { enabledPreview: null };

  const onDeleteSelectedProposals = async () => {
    setDeletingProposalIds(selectedProposalIds);

    if (!isUserOnCorrectChain) {
      await switchChain(config, { chainId: contestChainId });
    }

    await deleteProposal(selectedProposalIds);
    if (isDeleteSuccess) {
      setDeletingProposalIds([]);
    }
    setSelectedProposalIds([]);
  };

  const toggleProposalSelection = (proposalId: string) => {
    setSelectedProposalIds(prevIds => {
      if (prevIds.includes(proposalId)) {
        return prevIds.filter(id => id !== proposalId);
      } else {
        if (prevIds.length >= 50) {
          alert("You can only select up to 50 proposals in one take.");
          return prevIds;
        }
        return [...prevIds, proposalId];
      }
    });
  };

  if (isPageProposalsLoading && !listProposalsData.length) {
    return (
      <ListProposalsSkeleton
        enabledPreview={enabledPreview}
        highlightColor="#FFE25B"
        count={listProposalsIds.length > PROPOSALS_PER_PAGE ? PROPOSALS_PER_PAGE : listProposalsIds.length}
      />
    );
  }

  return (
    <InfiniteScroll
      className="infiniteScroll"
      dataLength={listProposalsData.length}
      next={() =>
        fetchProposalsPage(
          {
            chainId: contestChainId,
            address: contestAddress as `0x${string}`,
            abi,
          },
          version,
          currentPagePaginationProposals + 1,
          indexPaginationProposals[currentPagePaginationProposals + 1],
          totalPagesPaginationProposals,
          initialMappedProposalIds,
        )
      }
      hasMore={listProposalsData.length < submissionsCount}
      loader={
        <ListProposalsSkeleton
          enabledPreview={enabledPreview}
          highlightColor="#BB65FF"
          count={skeletonRemainingLoaderCount}
        />
      }
      scrollThreshold={isMobile ? 0.4 : 0.5}
    >
      <ListProposalsContainer enabledPreview={enabledPreview}>
        {listProposalsData.map((proposal, index) => {
          if (deletingProposalIds.includes(proposal.id) && isDeleteInProcess) {
            return (
              <ListProposalsSkeleton
                enabledPreview={enabledPreview}
                highlightColor="#FF78A9"
                count={selectedProposalIds.length}
              />
            );
          }
          return (
            <ProposalContent
              key={index}
              proposal={{
                id: proposal.id,
                authorEthereumAddress: proposal.author,
                content: proposal.description,
                exists: proposal.exists,
                isContentImage: proposal.isContentImage,
                tweet: proposal.tweet,
                votes: proposal.netVotes,
                rank: proposal.rank,
                isTied: proposal.isTied,
                commentsCount: proposal.commentsCount,
                metadataFields: proposal.metadataFields,
              }}
              enabledPreview={enabledPreview}
              selectedProposalIds={selectedProposalIds}
              toggleProposalSelection={toggleProposalSelection}
              contestAuthorEthereumAddress={contestAuthorEthereumAddress}
            />
          );
        })}
      </ListProposalsContainer>

      {showDeleteButton && (
        <div className="flex sticky bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
          <ButtonV3
            size={ButtonSize.EXTRA_LARGE}
            colorClass="bg-gradient-light-pink mx-auto animate-appear"
            onClick={onDeleteSelectedProposals}
          >
            Delete {selectedProposalIds.length} {selectedProposalIds.length === 1 ? "entry" : "entries"}
          </ButtonV3>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default ListProposals;
