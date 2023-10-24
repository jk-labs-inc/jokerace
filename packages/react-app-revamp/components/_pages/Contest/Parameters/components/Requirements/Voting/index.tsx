import { useContestStore } from "@hooks/useContest/store";
import useNftTokenDetails from "@hooks/useNftTokenDetails";
import moment from "moment";

const ContestParametersVotingRequirements = () => {
  const { votingRequirements } = useContestStore(state => state);
  const { tokenSymbol: votingRequirementsToken } = useNftTokenDetails(
    votingRequirements?.tokenAddress ?? "",
    votingRequirements?.chain ?? "",
  );

  if (!votingRequirements) return null;

  return (
    <>
      <li className="list-disc">
        you must be a holder of at least {votingRequirements.minTokensRequired}{" "}
        <span className="uppercase">{votingRequirementsToken} </span>
        <span className="normal-case">NFT {votingRequirements.minTokensRequired > 1 ? "s" : ""}</span> in order to
        receive votes.
      </li>
      <li className="list-disc">
        <span className="uppercase">{votingRequirementsToken}</span> holders snapshot was taken on{" "}
        {moment(votingRequirements.timestamp).format("MMMM Do, h:mm a")}
      </li>
    </>
  );
};

export default ContestParametersVotingRequirements;
