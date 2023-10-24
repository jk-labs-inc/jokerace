import { useContestStore } from "@hooks/useContest/store";
import useNftTokenDetails from "@hooks/useNftTokenDetails";
import moment from "moment";

const ContestParametersSubmissionRequirements = () => {
  const { submissionRequirements } = useContestStore(state => state);
  const { tokenSymbol: submissionRequirementToken } = useNftTokenDetails(
    submissionRequirements?.tokenAddress ?? "",
    submissionRequirements?.chain ?? "",
  );

  if (!submissionRequirements) return null;

  return (
    <>
      <li className="list-disc">
        you must be a holder of at least {submissionRequirements.minTokensRequired}{" "}
        <span className="uppercase">{submissionRequirementToken} </span>
        <span className="normal-case">NFT {submissionRequirements.minTokensRequired > 1 ? "s" : ""}</span> in order to
        submit.
      </li>
      <li className="list-disc">
        <span className="uppercase">{submissionRequirementToken}</span> holders snapshot was taken on{" "}
        {moment(submissionRequirements.timestamp).format("MMMM Do, h:mm a")}
      </li>
    </>
  );
};

export default ContestParametersSubmissionRequirements;
