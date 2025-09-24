import { useEntryContractConfigStore } from "@components/_pages/Submission/hooks/useEntryContractConfig/store";
import { useContestName } from "../../../../../../../../../../../hooks/useContestName";
import Link from "next/link";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { getChainFromId } from "@helpers/getChainFromId";

const SubmissionPageDesktopBodyContentInfoContestName = () => {
  const { contestAddress, contestChainId, contestAbi } = useEntryContractConfigStore();
  const { contestName, isLoading, isError } = useContestName({
    contestAddress: contestAddress,
    contestChainId: contestChainId,
    contestAbi: contestAbi,
  });
  const chain = getChainFromId(contestChainId);

  //TODO: add loading and error states

  return (
    <Link
      href={`${ROUTE_VIEW_CONTEST.replace("[chain]", chain?.name ?? "").replace("[address]", contestAddress)}`}
      className="text-positive-11 font-bold text-[16px]"
    >
      {contestName}
    </Link>
  );
};

export default SubmissionPageDesktopBodyContentInfoContestName;
