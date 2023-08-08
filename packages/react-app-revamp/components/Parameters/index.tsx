/* eslint-disable react/no-unescaped-entities */
import { formatNumber } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import moment from "moment";
import { useMemo } from "react";
import { CSVLink } from "react-csv";
import { useAccount } from "wagmi";

const UNLIMITED_PROPOSALS_PER_USER = 1000000;

const ContestParameters = () => {
  const { submissionsOpen, votesClose, votesOpen, voters, submitters, contestMaxProposalCount } = useContestStore(
    state => state,
  );
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const {
    contestMaxNumberSubmissionsPerUser,
    currentUserQualifiedToSubmit,
    currentUserQualifiedToVote,
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
  } = useUserStore(state => state);
  const formattedSubmissionsOpen = moment(submissionsOpen).format("MMMM Do, h:mm a");
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const formattedVotesClosing = moment(votesClose).format("MMMM Do, h:mm a");
  const userMaxProposalCountBN = BigNumber.from(contestMaxNumberSubmissionsPerUser);
  const maxProposalsPerUserCapped = userMaxProposalCountBN.eq(UNLIMITED_PROPOSALS_PER_USER);
  const processedSubmitters = submitters.map(submitter => ({
    address: submitter.address,
  }));

  const qualifyToSubmitMessage = useMemo<string | JSX.Element>(() => {
    if (!submitters.length) return `anyone can submit`;

    if (currentUserQualifiedToSubmit) {
      return `you qualify to submit`;
    } else {
      return `you don't qualify to submit`;
    }
  }, [currentUserQualifiedToSubmit, submitters.length]);

  const qualifyToVoteMessage = useMemo<string | JSX.Element>(() => {
    const canVote = currentUserAvailableVotesAmount > 0;

    if (canVote) {
      return (
        <p>
          you have <span className="font-bold">{formatNumber(currentUserAvailableVotesAmount)} votes</span>
        </p>
      );
    } else if (currentUserTotalVotesAmount > 0) {
      return "you're out of votes :(";
    }
    return "to vote, you must be on the allowlist";
  }, [currentUserAvailableVotesAmount, currentUserTotalVotesAmount]);

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
                : `a max of ${contestMaxNumberSubmissionsPerUser.toString()} submission `}
            </span>
          </li>
          <li className="list-disc">contest accept up to {contestMaxProposalCount.toString()} submissions</li>
          <li className="list-disc">{address ? qualifyToSubmitMessage : walletNotConnected}</li>
          {submitters.length ? (
            <li className="list-disc">
              see full allowlist{" "}
              <CSVLink data={processedSubmitters} filename={"submitters.csv"} className="text-positive-11">
                here
              </CSVLink>
            </li>
          ) : null}
        </ul>
      </div>
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">voting</p>
        <ul className="pl-4 text-[16px] font-bold">
          <li className="list-disc">{address ? qualifyToVoteMessage : walletNotConnected}</li>
          <li className="list-disc">
            see full allowlist{" "}
            <CSVLink data={voters} filename={"voters.csv"} className="text-positive-11">
              here
            </CSVLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContestParameters;
