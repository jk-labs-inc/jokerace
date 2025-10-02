import { useEnsName } from "wagmi";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";
import Link from "next/link";
import { ROUTE_VIEW_USER } from "@config/routes";
import useContestConfigStore from "@hooks/useContestConfig/store";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useShallow } from "zustand/shallow";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";

const SubmissionPageDesktopBodyContentInfoContestAuthor = () => {
  const contestAuthor = useSubmissionPageStore(useShallow(state => state.contestDetails.author));
  const {
    data: contestAuthorEnsName,
    isLoading: contestAuthorEnsNameLoading,
    isError: contestAuthorEnsNameError,
  } = useEnsName({
    address: contestAuthor as `0x${string}`,
    chainId: mainnet.id,
  });

  //TODO: add loading and error states
  if (contestAuthorEnsNameLoading) {
    return <div className="text-neutral-11 font-bold text-[12px]">by loading...</div>;
  }

  if (contestAuthorEnsNameError) {
    return <div className="text-neutral-11 font-bold text-[12px]">by error...</div>;
  }

  return (
    <div className="text-neutral-11 font-bold text-[12px]">
      by{" "}
      <Link
        className="text-positive-11"
        href={`${ROUTE_VIEW_USER.replace("[address]", contestAuthor as string)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contestAuthorEnsName || shortenEthereumAddress(contestAuthor as string)}
      </Link>
    </div>
  );
};

export default SubmissionPageDesktopBodyContentInfoContestAuthor;
