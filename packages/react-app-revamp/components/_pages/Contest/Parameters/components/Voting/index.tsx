import { formatNumber } from "@helpers/formatNumber";
import { FC, useMemo } from "react";
import ContestParamatersCSVVoters from "../CSV/Voters";
import ContestParametersVotingRequirements from "../Requirements/Voting";
import { VoteType } from "@hooks/useDeployContest/types";

interface ContestParametersVotingProps {
  anyoneCanVote: boolean;
  votingMerkleRoot: string;
  currentUserAvailableVotesAmount: number;
  currentUserTotalVotesAmount: number;
  address: string;
  voteCharge: {
    type: VoteType;
    cost: number;
  } | null;
  nativeCurrencySymbol?: string;
  votingRequirementsDescription?: string;
  openConnectModal?: () => void;
}

const ContestParametersVoting: FC<ContestParametersVotingProps> = ({
  anyoneCanVote,
  votingMerkleRoot,
  currentUserAvailableVotesAmount,
  currentUserTotalVotesAmount,
  address,
  voteCharge,
  nativeCurrencySymbol,
  votingRequirementsDescription,
  openConnectModal,
}) => {
  const qualifyToVoteMessage = useMemo<string | JSX.Element>(() => {
    const canVote = currentUserAvailableVotesAmount > 0;

    if (anyoneCanVote) {
      return (
        <p>
          you have{" "}
          <span className="font-bold">
            {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"}
          </span>
        </p>
      );
    }

    if (canVote) {
      return (
        <p>
          you have{" "}
          <span className="font-bold">
            {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"}{" "}
            {votingRequirementsDescription ? `(${votingRequirementsDescription})` : null}
          </span>
        </p>
      );
    } else if (currentUserTotalVotesAmount > 0) {
      return "you're out of votes :(";
    }
    return "to vote, you must be on the allowlist";
  }, [
    anyoneCanVote,
    voteCharge?.cost,
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
    nativeCurrencySymbol,
    votingRequirementsDescription,
  ]);

  const walletNotConnected = anyoneCanVote ? (
    <>
      <span className="text-positive-11 cursor-pointer font-bold" onClick={openConnectModal}>
        connect wallet
      </span>{" "}
      to add votes
    </>
  ) : (
    <>
      <span className="text-positive-11 cursor-pointer font-bold" onClick={openConnectModal}>
        connect wallet
      </span>{" "}
      to see if you qualify
    </>
  );

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[20px] font-bold text-neutral-10">voting</p>
      <ul className="pl-4 text-[16px] font-bold text-neutral-9">
        <li className="list-disc">{address ? qualifyToVoteMessage : walletNotConnected}</li>
        {anyoneCanVote ? (
          <li className="list-disc">anyone can vote</li>
        ) : (
          <>
            <ContestParametersVotingRequirements />
            <ContestParamatersCSVVoters votingMerkleRoot={votingMerkleRoot} />
          </>
        )}
      </ul>
    </div>
  );
};

export default ContestParametersVoting;
