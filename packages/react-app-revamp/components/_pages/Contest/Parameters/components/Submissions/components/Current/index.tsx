import { formatNumberWithCommas } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { useSubmitQualification } from "@hooks/useUserSubmitQualification";
import { useWallet } from "@hooks/useWallet";
import { useShallow } from "zustand/shallow";

const ContestParametersSubmissionsCurrent = () => {
  const { isConnected, userAddress } = useWallet();
  const { contestConfig } = useContestConfigStore(state => state);

  const { anyoneCanSubmit } = useSubmitQualification({
    address: contestConfig.address,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
    userAddress: userAddress as `0x${string}` | undefined,
    enabled: isConnected,
  });

  const { contestMaxProposalCount, contestMaxNumberSubmissionsPerUser } = useContestStore(
    useShallow(state => ({
      contestMaxProposalCount: state.contestMaxProposalCount,
      contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
    })),
  );

  const maxProposalsPerUserCapped = contestMaxNumberSubmissionsPerUser === MAX_SUBMISSIONS_LIMIT;

  const generateUserQualifiedMessage = () => {
    return anyoneCanSubmit ? "anyone can enter" : "only creator can enter";
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[24px] text-neutral-11">entering</p>
      <ul className="pl-4 text-[16px] text-neutral-9">
        <li className="list-disc">{generateUserQualifiedMessage()}</li>
        <li className="list-disc">
          {anyoneCanSubmit ? "players" : "creator"} can enter{" "}
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
      </ul>
    </div>
  );
};

export default ContestParametersSubmissionsCurrent;
