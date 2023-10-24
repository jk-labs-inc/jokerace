import { chains } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import useNftTokenDetails from "@hooks/useNftTokenDetails";
import moment from "moment";

const ContestParametersSubmissionRequirements = () => {
  const { submissionRequirements } = useContestStore(state => state);
  const { tokenSymbol: submissionRequirementToken } = useNftTokenDetails(
    submissionRequirements?.tokenAddress ?? "",
    submissionRequirements?.chain ?? "",
  );
  const chainExplorerUrl = chains.find(chain => chain.name === submissionRequirements?.chain)?.blockExplorers?.default
    .url;

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
          {submissionRequirementToken}
        </a>{" "}
        <span className="normal-case">NFT {submissionRequirements.minTokensRequired > 1 ? "s" : ""}</span>
      </li>
      <li className="list-disc">
        this snapshot of{" "}
        <a
          className="uppercase underline"
          href={`${chainExplorerUrl}token/${submissionRequirements.tokenAddress}`}
          target="_blank"
        >
          {submissionRequirementToken}
        </a>{" "}
        holders was taken on {moment(submissionRequirements.timestamp).format("MMMM Do, h:mm a")}
      </li>
    </>
  );
};

export default ContestParametersSubmissionRequirements;
