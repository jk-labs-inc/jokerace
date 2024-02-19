import { VotingRequirements } from "@hooks/useDeployContest/types";
import useTokenDetails from "@hooks/useTokenDetails";
import { FC } from "react";

interface CreateContestConfirmVotersPrefilledProps {
  votingRequirements: VotingRequirements;
}

const CreateContestConfirmVotersPrefilled: FC<CreateContestConfirmVotersPrefilledProps> = ({ votingRequirements }) => {
  const { tokenSymbol, isLoading } = useTokenDetails(
    votingRequirements.type,
    votingRequirements.tokenAddress,
    votingRequirements.chain,
  );

  if (isLoading) {
    return <li className="loadingDots list-disc font-sabo text-[14px] text-neutral-14">loading voters allowlist</li>;
  }

  if (votingRequirements.type === "erc20") {
    return (
      <li className="text-[16px] list-disc">
        <span className="uppercase">${tokenSymbol}</span> holders can vote
      </li>
    );
  } else {
    return (
      <li className="text-[16px] list-disc">
        <span className="uppercase">{tokenSymbol} NFT</span> holders can vote
      </li>
    );
  }
};

export default CreateContestConfirmVotersPrefilled;
