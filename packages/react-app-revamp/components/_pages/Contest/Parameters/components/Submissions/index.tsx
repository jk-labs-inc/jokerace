import { FC, useMemo } from "react";
import ContestParamatersCSVSubmitters from "../CSV/Submitters";
import ContestParametersSubmissionRequirements from "../Requirements/Submission";
import { formatNumberWithCommas } from "@helpers/formatNumber";
import { Charge } from "@hooks/useDeployContest/types";
import { formatEther } from "viem";

interface ContestParametersSubmissionsProps {
  charge: Charge;
  anyoneCanSubmit: boolean;
  currentUserQualifiedToSubmit: boolean;
  contestMaxNumberSubmissionsPerUser: number;
  contestMaxProposalCount: number;
  maxProposalsPerUserCapped: boolean;
  submissionMerkleRoot: string;
  address: string;
  nativeCurrencySymbol?: string;
  openConnectModal?: () => void;
}

const ContestParametersSubmissions: FC<ContestParametersSubmissionsProps> = ({
  charge,
  anyoneCanSubmit,
  currentUserQualifiedToSubmit,
  contestMaxNumberSubmissionsPerUser,
  contestMaxProposalCount,
  maxProposalsPerUserCapped,
  submissionMerkleRoot,
  address,
  nativeCurrencySymbol,
  openConnectModal,
}) => {
  const qualifyToSubmitMessage = useMemo<string | React.JSX.Element>(() => {
    if (anyoneCanSubmit) return `anyone can enter`;

    if (currentUserQualifiedToSubmit) {
      return `you qualify to enter`;
    } else {
      return `you don't qualify to enter`;
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
      <p className="text-[24px] text-neutral-11">entering</p>
      <ul className="pl-4 text-[16px] text-neutral-9">
        <li className="list-disc">{address || anyoneCanSubmit ? qualifyToSubmitMessage : walletNotConnected}</li>
        <li className="list-disc">
          {formatEther(BigInt(charge.type.costToPropose))} {nativeCurrencySymbol} to enter
        </li>
        <li className="list-disc">
          {!anyoneCanSubmit && "qualified"} players can enter{" "}
          <span>
            {maxProposalsPerUserCapped
              ? "as many times as desired"
              : `a max of ${formatNumberWithCommas(contestMaxNumberSubmissionsPerUser)} ${
                  contestMaxNumberSubmissionsPerUser > 1 ? "entries" : "entry"
                } `}
          </span>
        </li>
        <li className="list-disc">
          contest accept{contestMaxProposalCount > 1 ? "s" : ""} up to {formatNumberWithCommas(contestMaxProposalCount)}{" "}
          entries
        </li>
        <ContestParametersSubmissionRequirements />
        {!anyoneCanSubmit ? <ContestParamatersCSVSubmitters submissionMerkleRoot={submissionMerkleRoot} /> : null}
      </ul>
    </div>
  );
};

export default ContestParametersSubmissions;
