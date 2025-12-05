import { createFileRoute } from "@tanstack/react-router";
import { parse } from "node-html-parser";
import type { Abi } from "viem";
import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { ContestWrapper } from "@hooks/useContest/store";
import { ContestConfigStoreProvider } from "@hooks/useContestConfig/store";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { UserWrapper } from "@hooks/useUserSubmitQualification/store";
import LayoutViewContest from "@layouts/LayoutViewContest";
import { getContestData, type ContestConfig, type ContestMetadata } from "lib/contest";

const DEFAULT_METADATA: ContestMetadata = {
  title: "Contest",
  description: "",
};

export const Route = createFileRoute("/contest/$chain/$address/")({
  loader: ({ params }) => getContestData(params.chain, params.address),

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: DEFAULT_METADATA.title }, { name: "description", content: DEFAULT_METADATA.description }],
      };
    }

    try {
      const { contestDetails } = loaderData;
      const contestTitle = contestDetails.name;
      const contestPrompt = parsePrompt(contestDetails.prompt);
      const contestDescriptionRaw =
        contestPrompt.contestSummary + contestPrompt.contestEvaluate + contestPrompt.contestContactDetails;
      const contestDescription = parse(contestDescriptionRaw).textContent;

      return {
        meta: [
          { title: contestTitle || DEFAULT_METADATA.title },
          { name: "description", content: contestDescription },
          { property: "og:title", content: contestTitle || DEFAULT_METADATA.title },
          { property: "og:description", content: contestDescription },
          { name: "twitter:title", content: contestTitle || DEFAULT_METADATA.title },
          { name: "twitter:description", content: contestDescription },
        ],
      };
    } catch (error) {
      console.error("Failed to generate metadata:", error);
      return {
        meta: [{ title: DEFAULT_METADATA.title }, { name: "description", content: DEFAULT_METADATA.description }],
      };
    }
  },

  component: ContestPage,
});

function ContestPage() {
  const { address, chain, chainId, abi, version } = Route.useLoaderData();

  const contestConfig: ContestConfig = {
    address: address as `0x${string}`,
    chainName: chain,
    chainId,
    chainNativeCurrencySymbol: getNativeTokenSymbol(chain) ?? "",
    abi: abi as Abi,
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
}
