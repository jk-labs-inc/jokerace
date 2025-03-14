import { FC } from "react";

import { VotingRequirements } from "@hooks/useDeployContest/types";
import useTokenDetails from "@hooks/useTokenDetails";

interface CreateContestConfirmEntryContestVotingProps {
  votingAllowlist: {
    csv: Record<string, number>;
    prefilled: Record<string, number>;
  };
  votingRequirements: VotingRequirements;
}

const CreateContestConfirmEntryContestVoting: FC<CreateContestConfirmEntryContestVotingProps> = ({
  votingAllowlist,
  votingRequirements,
}) => {
  const { tokenSymbol, isLoading } = useTokenDetails(
    votingRequirements.type,
    votingRequirements.tokenAddress,
    votingRequirements.chain,
  );

  if (Object.keys(votingAllowlist.csv).length > 0) {
    return (
      <>
        <span className="uppercase">CSV</span> allowlisted players can vote
      </>
    );
  }

  if (isLoading) {
    return <li className="loadingDots list-disc font-sabo text-[14px] text-neutral-14">loading voters allowlist</li>;
  }

  if (votingRequirements.type === "erc20") {
    return (
      <>
        <span className="uppercase">${tokenSymbol}</span> holders can vote
      </>
    );
  } else {
    return (
      <>
        <span className="uppercase">{tokenSymbol}</span> NFT holders can vote
      </>
    );
  }
};

export default CreateContestConfirmEntryContestVoting;
