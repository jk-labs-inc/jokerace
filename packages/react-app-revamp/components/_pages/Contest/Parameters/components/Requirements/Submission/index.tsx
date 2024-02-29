import { chains } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import useTokenDetails from "@hooks/useTokenDetails";
import moment from "moment";

const ContestParametersSubmissionRequirements = () => {
  const { submissionRequirements } = useContestStore(state => state);
  const { tokenSymbol: submissionRequirementToken } = useTokenDetails(
    submissionRequirements?.type ?? "",
    submissionRequirements?.tokenAddress ?? "",
    submissionRequirements?.chain ?? "",
  );

  const chainExplorerUrl = chains.find((chain: { name: string }) => chain.name === submissionRequirements?.chain)
    ?.blockExplorers?.default.url;

  if (!submissionRequirements) return null;

  return (
    <>
      <li className="list-disc">
        in order to submit, you must own at least {submissionRequirements.minTokensRequired}{" "}
        <a
          className="uppercase underline"
          href={`${chainExplorerUrl}token/${submissionRequirements.tokenAddress}`}
          target="_blank"
        >
          {submissionRequirements.type === "erc20" ? "$" : ""}
          {submissionRequirementToken}
        </a>{" "}
        {submissionRequirements.type === "erc721" ? (
          <span className="normal-case">
            NFT
            {submissionRequirements.minTokensRequired > 1 ? "s" : ""}
          </span>
        ) : null}
      </li>
      <li className="list-disc">
        this snapshot of{" "}
        <a
          className="uppercase underline"
          href={`${chainExplorerUrl}token/${submissionRequirements.tokenAddress}`}
          target="_blank"
        >
          {submissionRequirements.type === "erc20" ? "$" : ""}
          {submissionRequirementToken}
        </a>{" "}
        holders was taken on {moment(submissionRequirements.timestamp).format("MMMM Do, h:mm a")}
      </li>
    </>
  );
};

export default ContestParametersSubmissionRequirements;
