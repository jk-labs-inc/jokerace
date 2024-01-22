import { chains } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import useTokenDetails from "@hooks/useTokenDetails";
import moment from "moment";

const ContestParametersVotingRequirements = () => {
  const { votingRequirements } = useContestStore(state => state);
  const { tokenSymbol: votingRequirementsToken } = useTokenDetails(
    votingRequirements?.type ?? "",
    votingRequirements?.tokenAddress ?? "",
    votingRequirements?.chain ?? "",
  );

  const chainExplorerUrl = chains.find(chain => chain.name === votingRequirements?.chain)?.blockExplorers?.default.url;

  if (!votingRequirements) return null;

  return (
    <>
      <li className="list-disc">
        in order to receive votes, you must own at least {votingRequirements.minTokensRequired}{" "}
        <a
          className="uppercase underline"
          href={`${chainExplorerUrl}token/${votingRequirements.tokenAddress}`}
          target="_blank"
        >
          {votingRequirements.type === "erc20" ? "$" : ""}
          {votingRequirementsToken}
        </a>{" "}
        {votingRequirements.type === "erc721" ? (
          <span className="normal-case">
            NFT
            {votingRequirements.minTokensRequired > 1 ? "s" : ""}
          </span>
        ) : null}
      </li>
      <li className="list-disc">
        this snapshot of{" "}
        <a
          className="uppercase underline"
          href={`${chainExplorerUrl}token/${votingRequirements.tokenAddress}`}
          target="_blank"
        >
          {votingRequirements.type === "erc20" ? "$" : ""}
          {votingRequirementsToken}
        </a>{" "}
        holders was taken on {moment(votingRequirements.timestamp).format("MMMM Do, h:mm a")}
      </li>
    </>
  );
};

export default ContestParametersVotingRequirements;
