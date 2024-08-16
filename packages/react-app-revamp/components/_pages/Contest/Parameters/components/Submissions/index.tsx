import { FC, useMemo } from "react";
import ContestParamatersCSVSubmitters from "../CSV/Submitters";
import ContestParametersSubmissionRequirements from "../Requirements/Submission";
import { formatEther } from "viem";

interface ContestParametersSubmissionsProps {
  anyoneCanSubmit: boolean;
  currentUserQualifiedToSubmit: boolean;
  contestMaxNumberSubmissionsPerUser: number;
  contestMaxProposalCount: number;
  maxProposalsPerUserCapped: boolean;
  submissionMerkleRoot: string;
  address: string;
  nativeCurrencySymbol?: string;
  costToPropose?: number;
  openConnectModal?: () => void;
}

const ContestParametersSubmissions: FC<ContestParametersSubmissionsProps> = ({
  anyoneCanSubmit,
  currentUserQualifiedToSubmit,
  contestMaxNumberSubmissionsPerUser,
  contestMaxProposalCount,
  maxProposalsPerUserCapped,
  submissionMerkleRoot,
  address,
  nativeCurrencySymbol,
  costToPropose,
  openConnectModal,
}) => {
  const qualifyToSubmitMessage = useMemo<string | JSX.Element>(() => {
    if (anyoneCanSubmit) return `anyone can submit`;

    if (currentUserQualifiedToSubmit) {
      return `you qualify to submit`;
    } else {
      return `you don't qualify to submit`;
    }
  }, [currentUserQualifiedToSubmit, anyoneCanSubmit]);

  const walletNotConnected = (
    <>
      <span className="text-positive-11 cursor-pointer font-bold" onClick={openConnectModal}>
        connect wallet
      </span>{" "}
      to see if you qualify
    </>
  );

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[20px] font-bold text-neutral-14">submissions</p>
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
          contest accept{contestMaxProposalCount > 1 ? "s" : ""} up to {contestMaxProposalCount.toString()} submissions
        </li>
        <li className="list-disc">{address || anyoneCanSubmit ? qualifyToSubmitMessage : walletNotConnected}</li>
        <ContestParametersSubmissionRequirements />
        {!anyoneCanSubmit ? <ContestParamatersCSVSubmitters submissionMerkleRoot={submissionMerkleRoot} /> : null}
        {costToPropose ? (
          <li className="list-disc">
            {formatEther(BigInt(costToPropose))} {nativeCurrencySymbol}/submission
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default ContestParametersSubmissions;
