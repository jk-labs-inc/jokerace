import { createFileRoute, notFound } from "@tanstack/react-router";
import { parsePrompt } from "@components/_pages/Contest/components/Prompt/utils";
import { getChainId } from "@helpers/getChainId";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContracts } from "@wagmi/core";
import { parse } from "node-html-parser";
import { Abi } from "viem";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { CastVotesWrapper } from "@hooks/useCastVotes/store";
import { ContestWrapper } from "@hooks/useContest/store";
import { ContestConfigStoreProvider } from "@hooks/useContestConfig/store";
import { DeleteProposalWrapper } from "@hooks/useDeleteProposal/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { UserWrapper } from "@hooks/useUserSubmitQualification/store";
import LayoutViewContest from "@layouts/LayoutViewContest";
import { config, chains } from "@config/wagmi";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const defaultMetadata = {
  title: "Contest",
  description: "",
};

async function getContestDetails(address: string, chainName: string) {
  try {
    const chainId = chains.filter(
      (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
    )?.[0]?.id;

    const { abi } = await getContestContractVersion(address, chainId);

    const contracts = [
      {
        address: address as `0x${string}`,
        abi: abi as Abi,
        functionName: "name",
        args: [],
      },
      {
        address: address as `0x${string}`,
        abi: abi as Abi,
        chainId,
        functionName: "prompt",
        args: [],
      },
    ];

    const results = (await readContracts(config, { contracts })) as any;
    return results;
  } catch (error) {
    console.error("failed to fetch contest details:", error);
    return [{ result: "" }, { result: "||" }];
  }
}

export const Route = createFileRoute("/contest/$chain/$address/")({
  loader: async ({ params }) => {
    const { chain, address } = params;

    if (!REGEX_ETHEREUM_ADDRESS.test(address)) {
      throw notFound();
    }

    const isValidChain = chains.some(
      (c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain.toLowerCase(),
    );

    if (!isValidChain) {
      throw notFound();
    }

    const chainId = getChainId(chain);
    const { abi, version } = await getContestContractVersion(address, chainId);

    const contestDetails = await getContestDetails(address, chain);

    return {
      address,
      chain,
      chainId,
      abi: abi as Abi,
      version,
      contestDetails,
    };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: defaultMetadata.title }, { name: "description", content: defaultMetadata.description }],
      };
    }

    try {
      const contestTitle = loaderData.contestDetails[0].result as string;
      const prompt = loaderData.contestDetails[1].result as string;
      const contestPrompt = parsePrompt(prompt);
      const contestDescriptionRaw =
        contestPrompt.contestSummary + contestPrompt.contestEvaluate + contestPrompt.contestContactDetails;
      const contestDescription = parse(contestDescriptionRaw).textContent;

      return {
        meta: [
          { title: contestTitle || defaultMetadata.title },
          { name: "description", content: contestDescription },
          { property: "og:title", content: contestTitle || defaultMetadata.title },
          { property: "og:description", content: contestDescription },
          { name: "twitter:title", content: contestTitle || defaultMetadata.title },
          { name: "twitter:description", content: contestDescription },
        ],
      };
    } catch (error) {
      console.error("failed to generate metadata:", error);
      return {
        meta: [{ title: defaultMetadata.title }, { name: "description", content: defaultMetadata.description }],
      };
    }
  },

  component: ContestPage,
});

function ContestPage() {
  const { address, chain, chainId, abi, version } = Route.useLoaderData();

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
}
