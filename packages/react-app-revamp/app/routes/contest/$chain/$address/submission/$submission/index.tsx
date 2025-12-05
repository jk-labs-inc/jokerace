import { createFileRoute } from "@tanstack/react-router";
import { getSubmissionData, type SubmissionMetadata } from "lib/submission";
import type { Abi } from "viem";
import SubmissionWrapper from "@components/_pages/Submission/Wrapper";

const DEFAULT_METADATA: SubmissionMetadata = {
  title: "Contest Entry on JokeRace",
  description: "Contest Entry on JokeRace",
};

export const Route = createFileRoute("/contest/$chain/$address/submission/$submission/")({
  loader: ({ params }) => getSubmissionData(params.chain, params.address, params.submission),

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: DEFAULT_METADATA.title }, { name: "description", content: DEFAULT_METADATA.description }],
      };
    }

    const title = `Entry for ${loaderData.contestName} contest on JokeRace`;
    const description = `Entry for ${loaderData.contestName} contest on JokeRace`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },

  component: SubmissionPage,
});

function SubmissionPage() {
  const { address, chain, submission, abi, version, chainId } = Route.useLoaderData();

  return (
    <SubmissionWrapper
      address={address}
      chain={chain}
      submission={submission}
      abi={abi as Abi}
      version={version}
      chainId={chainId}
    />
  );
}
