import { useContestAuthor } from "../../../../../../../../../../../hooks/useContestAuthor";
import { useEnsName } from "wagmi";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";
import Link from "next/link";
import { ROUTE_VIEW_USER } from "@config/routes";
import useContestConfigStore from "@hooks/useContestConfig/store";

const SubmissionPageDesktopBodyContentInfoContestAuthor = () => {
  const { contestConfig } = useContestConfigStore(state => state);
  const { contestAuthor, isLoading, isError } = useContestAuthor({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
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
