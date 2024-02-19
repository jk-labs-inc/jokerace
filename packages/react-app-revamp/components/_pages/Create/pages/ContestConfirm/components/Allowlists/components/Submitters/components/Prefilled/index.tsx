import { SubmissionRequirements } from "@hooks/useDeployContest/types";
import useTokenDetails from "@hooks/useTokenDetails";
import { FC } from "react";

interface CreateContestConfirmAlowlistsSubmittersPrefilledProps {
  submissionRequirements: SubmissionRequirements;
}

const CreateContestConfirmAlowlistsSubmittersPrefilled: FC<CreateContestConfirmAlowlistsSubmittersPrefilledProps> = ({
  submissionRequirements,
}) => {
  const { tokenSymbol, isLoading } = useTokenDetails(
    submissionRequirements.type,
    submissionRequirements.tokenAddress,
    submissionRequirements.chain,
  );

  if (isLoading) {
    return (
      <li className="loadingDots list-disc font-sabo text-[14px] text-neutral-14">loading submitters allowlist</li>
    );
  }

  if (submissionRequirements.type === "erc20") {
    return (
      <li className="text-[16px] list-disc">
        <span className="uppercase">${tokenSymbol}</span> holders can submit
      </li>
    );
  } else {
    return (
      <li className="text-[16px] list-disc">
        <span className="uppercase">{tokenSymbol} NFT</span> holders can submit
      </li>
    );
  }
};

export default CreateContestConfirmAlowlistsSubmittersPrefilled;
