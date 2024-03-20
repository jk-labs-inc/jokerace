import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { EMPTY_ROOT } from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatEther } from "ethers/lib/utils";
import moment from "moment";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import ContestParamatersCSVSubmitters from "./components/CSV/Submitters";
import ContestParamatersCSVVoters from "./components/CSV/Voters";
import ContestParametersSubmissionRequirements from "./components/Requirements/Submission";
import ContestParametersVotingRequirements from "./components/Requirements/Voting";

const UNLIMITED_PROPOSALS_PER_USER = 1000000;

const ContestParameters = () => {
  const {
    submissionsOpen,
    votesClose,
    votesOpen,
    contestMaxProposalCount,
    votingRequirements,
    submissionMerkleRoot,
    votingMerkleRoot,
    anyoneCanVote,
    charge,
  } = useContestStore(state => state);
  const asPath = useRouter().asPath;
  const { chainName } = extractPathSegments(asPath);
  const nativeCurrency = chains.find(chain => chain.name === chainName.toLowerCase())?.nativeCurrency;
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const {
    contestMaxNumberSubmissionsPerUser,
    currentUserQualifiedToSubmit,
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
  } = useUserStore(state => state);
  const formattedSubmissionsOpen = moment(submissionsOpen).format("MMMM Do, h:mm a");
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const formattedVotesClosing = moment(votesClose).format("MMMM Do, h:mm a");
  const maxProposalsPerUserCapped = contestMaxNumberSubmissionsPerUser == UNLIMITED_PROPOSALS_PER_USER;
  const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;

  const qualifyToSubmitMessage = useMemo<string | JSX.Element>(() => {
    if (anyoneCanSubmit) return `anyone can submit`;

    if (currentUserQualifiedToSubmit) {
      return `you qualify to submit`;
    } else {
      return `you don't qualify to submit`;
    }
  }, [currentUserQualifiedToSubmit, anyoneCanSubmit]);

  const qualifyToVoteMessage = useMemo<string | JSX.Element>(() => {
    const canVote = currentUserAvailableVotesAmount > 0;

    if (anyoneCanVote) {
      return (
        <p>
          you have{" "}
          <span className="font-bold">
            {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount == 1 ? "" : "s"} ( 1
            vote = {formatEther(BigInt(charge?.type.costToVote ?? 0))} {nativeCurrency?.symbol})
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
            {votingRequirements ? `(${votingRequirements.description})` : null}
          </span>
        </p>
      );
    } else if (currentUserTotalVotesAmount > 0) {
      return "you're out of votes :(";
    }
    return "to vote, you must be on the allowlist";
  }, [
    anyoneCanVote,
    charge?.type.costToVote,
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
    nativeCurrency?.symbol,
    votingRequirements,
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
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">timeline</p>
        <div className="flex flex-col gap-4 md:w-96">
          <div className="flex justify-between items-end text-[16px] font-bold border-b border-neutral-10 pb-3">
            <p>submissions open:</p>
            <p>{formattedSubmissionsOpen}</p>
          </div>
          <div className="flex justify-between items-end text-[16px] font-bold  border-b border-neutral-10 pb-3">
            <p>
              submissions close/
              <br />
              voting opens:
            </p>
            <p>{formattedVotesOpen}</p>
          </div>
          <div className="flex justify-between items-end text-[16px] font-bold  border-b border-neutral-10 pb-3">
            <p>voting closes:</p>
            <p>{formattedVotesClosing}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">submissions</p>
        <ul className="pl-4 text-[16px] font-bold">
          <li className="list-disc">
            qualified wallets can enter{" "}
            <span>
              {maxProposalsPerUserCapped
                ? "as many submissions as desired"
                : `a max of ${contestMaxNumberSubmissionsPerUser.toString()} submission${
                    contestMaxNumberSubmissionsPerUser > 1 ? "s" : ""
                  } `}
            </span>
          </li>
          <li className="list-disc">
            contest accept{contestMaxProposalCount > 1 ? "s" : ""} up to {contestMaxProposalCount.toString()}{" "}
            submissions
          </li>
          <li className="list-disc">{address || anyoneCanSubmit ? qualifyToSubmitMessage : walletNotConnected}</li>
          <ContestParametersSubmissionRequirements />
          {!anyoneCanSubmit ? <ContestParamatersCSVSubmitters submissionMerkleRoot={submissionMerkleRoot} /> : null}
        </ul>
      </div>
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">voting</p>
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
        </ul>
      </div>
    </div>
  );
};

export default ContestParameters;
