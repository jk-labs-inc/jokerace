import { useEntryContractConfigStore } from "@components/_pages/Submission/hooks/useEntryContractConfig/store";
import { useContestAuthor } from "../../../../../../../../../../../hooks/useContestAuthor";
import { useEnsName } from "wagmi";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";
import Link from "next/link";
import { ROUTE_VIEW_USER } from "@config/routes";

const SubmissionPageDesktopBodyContentInfoContestAuthor = () => {
  const { contestAddress, contestChainId, contestAbi } = useEntryContractConfigStore();
  const { contestAuthor, isLoading, isError } = useContestAuthor({
    contestAddress: contestAddress,
    contestChainId: contestChainId,
    contestAbi: contestAbi,
  });
  const {
    data: contestAuthorEnsName,
    isLoading: contestAuthorEnsNameLoading,
    isError: contestAuthorEnsNameError,
  } = useEnsName({
    address: contestAuthor as `0x${string}`,
    chainId: mainnet.id,
    query: {
      enabled: !isLoading && !isError,
    },
  });

  //TODO: add loading and error states

  return (
    <div className="text-neutral-11 font-bold text-[12px]">
      by{" "}
      <Link
        className="text-positive-11"
        href={`${ROUTE_VIEW_USER.replace("[address]", contestAuthor)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contestAuthorEnsName || contestAuthor}
      </Link>
    </div>
  );
};

export default SubmissionPageDesktopBodyContentInfoContestAuthor;
