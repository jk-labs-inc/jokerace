import { formatNumberWithCommas } from "@helpers/formatNumber";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { MAX_SUBMISSIONS_PER_CONTEST } from "@hooks/useDeployContest/types";
import { AnyoneCanSubmit, useUserStore } from "@hooks/useUserSubmitQualification/store";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";

const generateUserQualifiedMessage = (anyoneCanSubmit: AnyoneCanSubmit) => {
  return anyoneCanSubmit === AnyoneCanSubmit.ANYONE_CAN_SUBMIT ? "anyone can enter" : "only creator can enter";
};

const ContestParametersSubmissionsCurrent = () => {
  const { anyoneCanSubmit, contestMaxNumberSubmissionsPerUser } = useUserStore(
    useShallow(state => ({
      anyoneCanSubmit: state.anyoneCanSubmit,
      contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
    })),
  );

  const chainNativeCurrencySymbol = useContestConfigStore(
    useShallow(state => state.contestConfig.chainNativeCurrencySymbol),
  );
  const { charge, contestMaxProposalCount } = useContestStore(
    useShallow(state => ({
      charge: state.charge,
      contestMaxProposalCount: state.contestMaxProposalCount,
    })),
  );

  const maxProposalsPerUserCapped = contestMaxNumberSubmissionsPerUser == MAX_SUBMISSIONS_PER_CONTEST;

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[24px] text-neutral-11">entering</p>
      <ul className="pl-4 text-[16px] text-neutral-9">
        <li className="list-disc">{generateUserQualifiedMessage(anyoneCanSubmit)}</li>
        <li className="list-disc">
          {formatEther(BigInt(charge.type.costToPropose))} {chainNativeCurrencySymbol} to enter
        </li>
        <li className="list-disc">
          {anyoneCanSubmit === AnyoneCanSubmit.ANYONE_CAN_SUBMIT ? "players" : "creator"} can enter{" "}
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
