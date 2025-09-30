import useContestConfigStore from "@hooks/useContestConfig/store";
import { useContestName } from "../../../../../../../../../../../hooks/useContestName";
import Link from "next/link";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { getChainFromId } from "@helpers/getChainFromId";

const SubmissionPageDesktopBodyContentInfoContestName = () => {
  const { contestConfig } = useContestConfigStore(state => state);
  const { contestName, isLoading, isError } = useContestName({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });
  const chain = getChainFromId(contestConfig.chainId);

  //TODO: add loading and error states

  return (
    <Link
      href={`${ROUTE_VIEW_CONTEST.replace("[chain]", chain?.name.toLowerCase() ?? "").replace(
        "[address]",
        contestConfig.address,
      )}`}
      className="text-positive-11 font-bold text-[16px]"
    >
      {contestName}
    </Link>
  );
};

export default SubmissionPageDesktopBodyContentInfoContestName;
