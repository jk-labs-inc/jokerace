import { BigNumber } from "ethers";
import moment from "moment";
import { FC } from "react";
import { CSVLink } from "react-csv";

interface ContestParametersProps {
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  voters: {
    address: string;
    numVotes: number;
  }[];
  submitters: {
    address: string;
  }[];
  contestMaxProposalCount: number;
  userMaxProposalCount: number;
}

const UNLIMITED_PROPOSALS_PER_USER = 1000000;

const ContestParameters: FC<ContestParametersProps> = ({ ...props }) => {
  const formattedSubmissionsOpen = moment(props.submissionOpen).format("MMMM Do, h:mm a");
  const formattedVotesOpen = moment(props.votingOpen).format("MMMM Do, h:mm a");
  const formattedVotesClosing = moment(props.votingClose).format("MMMM Do, h:mm a");
  const userMaxProposalCountBN = BigNumber.from(props.userMaxProposalCount);
  const maxProposalsPerUserCapped = userMaxProposalCountBN.eq(UNLIMITED_PROPOSALS_PER_USER);
  const processedSubmitters = props.submitters.map(submitter => ({
    address: submitter.address,
  }));

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">timeline</p>
        <div className="flex flex-col gap-4">
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
                : `a max of ${props.userMaxProposalCount.toString()} submission `}
            </span>
          </li>
          <li className="list-disc">contest accept up to {props.contestMaxProposalCount.toString()} submissions</li>
          <li className="list-disc">
            see full allowlist{" "}
            <CSVLink data={processedSubmitters} filename={"submitters.csv"} className="text-positive-11">
              here
            </CSVLink>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-12">
        <p className="text-[24px] font-bold text-neutral-11">voting</p>
        <ul className="pl-4 text-[16px] font-bold">
          <li className="list-disc">to vote, you must be on the allowlist</li>
          <li className="list-disc">
            see full allowlist{" "}
            <CSVLink data={props.voters} filename={"voters.csv"} className="text-positive-11">
              here
            </CSVLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContestParameters;
