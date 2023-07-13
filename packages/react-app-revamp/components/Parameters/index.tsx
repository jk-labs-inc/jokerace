import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "@hooks/useUser/store";
import { BigNumber } from "ethers";
import moment from "moment";
import { FC } from "react";
import { CSVLink } from "react-csv";

const UNLIMITED_PROPOSALS_PER_USER = 1000000;

const ContestParameters = () => {
  const { submissionsOpen, votesClose, votesOpen, voters, submitters, contestMaxProposalCount } = useContestStore(
    state => state,
  );
  const contestMaxNumberSubmissionsPerUser = useUserStore(state => state.contestMaxNumberSubmissionsPerUser);
  const formattedSubmissionsOpen = moment(submissionsOpen).format("MMMM Do, h:mm a");
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const formattedVotesClosing = moment(votesClose).format("MMMM Do, h:mm a");
  const userMaxProposalCountBN = BigNumber.from(contestMaxNumberSubmissionsPerUser);
  const maxProposalsPerUserCapped = userMaxProposalCountBN.eq(UNLIMITED_PROPOSALS_PER_USER);
  const processedSubmitters = submitters.map(submitter => ({
    address: submitter.address,
  }));

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

          {submitters.length ? (
            <li className="list-disc">
              {" "}
              see full allowlist
              <CSVLink data={processedSubmitters} filename={"submitters.csv"} className="text-positive-11">
                here
              </CSVLink>
            </li>
          ) : (
            <li className="list-disc">anyone can submit</li>
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">voting</p>
        <ul className="pl-4 text-[16px] font-bold">
          <li className="list-disc">to vote, you must be on the allowlist</li>
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
