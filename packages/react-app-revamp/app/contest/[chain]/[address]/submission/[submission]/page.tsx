import { notFound } from "next/navigation";
import Submission from "./submission";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const Page = async (props: { params: Promise<{ chain: string; address: string; submission: string }> }) => {
  const params = await props.params;
  const { chain, address, submission } = params;

  console.log(chain, address, submission);

  try {
    if (!REGEX_ETHEREUM_ADDRESS.test(address)) {
      return notFound();
    }

    return <Submission address={address} chain={chain} submission={submission} />;
  } catch (error) {
    console.error("failed to render submission page:", error);
    return notFound();
  }
};

export default Page;
