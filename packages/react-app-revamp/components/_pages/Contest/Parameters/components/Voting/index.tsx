import { formatNumber } from "@helpers/formatNumber";
import { FC, useMemo } from "react";
import { formatEther } from "viem";
import ContestParametersVotingRequirements from "../Requirements/Voting";
import ContestParamatersCSVVoters from "../CSV/Voters";

interface ContestParametersVotingProps {
  anyoneCanVote: boolean;
  votingMerkleRoot: string;
  currentUserAvailableVotesAmount: number;
  currentUserTotalVotesAmount: number;
  address: string;
  costToVote?: number;
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
  costToVote,
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
            {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"} ( 1
            vote = {formatEther(BigInt(costToVote ?? 0))} {nativeCurrencySymbol})
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
    costToVote,
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
    nativeCurrencySymbol,
    votingRequirementsDescription,
  ]);

  const walletNotConnected = (
    <>
      <span className="text-positive-11 cursor-pointer font-bold" onClick={openConnectModal}>
        connect wallet
      </span>{" "}
      to see if you qualify
    </>
  );

  return (
    <div className="flex flex-col gap-12">
      <p className="text-[20px] font-bold text-neutral-11">voting</p>
      <ul className="pl-4 text-[16px] font-bold">
        <li className="list-disc">{address ? qualifyToVoteMessage : walletNotConnected}</li>
        {anyoneCanVote ? (
          <li className="list-disc">anyone can vote</li>
        ) : (
          <>
            <ContestParametersVotingRequirements />
            <ContestParamatersCSVVoters votingMerkleRoot={votingMerkleRoot} />
          </>
        )}
        {costToVote ? (
          <li className="list-disc">
            {formatEther(BigInt(costToVote))} {nativeCurrencySymbol}/vote
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default ContestParametersVoting;
