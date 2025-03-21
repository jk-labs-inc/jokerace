import { chains } from "@config/wagmi/server";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { notFound } from "next/navigation";
import { Abi } from "viem";
import Submission from "./submission";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const Page = async (props: { params: Promise<{ chain: string; address: string; submission: string }> }) => {
  const params = await props.params;
  const { chain, address, submission } = params;

  try {
    const chainId = chains.find(
      (c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain.toLowerCase(),
    )?.id;
    const { abi, version } = await getContestContractVersion(address, chainId ?? 1);

    if (!REGEX_ETHEREUM_ADDRESS.test(address)) {
      return notFound();
    }

    return <Submission address={address} chain={chain} submission={submission} abi={abi as Abi} version={version} />;
  } catch (error) {
    console.error("failed to render submission page:", error);
    return notFound();
  }
};

export default Page;
