import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import CustomLink from "@components/UI/Link";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { getChainFromId } from "@helpers/getChainFromId";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";

const SubmissionPageDesktopBodyContentInfoContestName = () => {
  const { contestConfig } = useContestConfigStore(state => state);
  const contestName = useSubmissionPageStore(useShallow(state => state.contestDetails.name));
  const chain = getChainFromId(contestConfig.chainId);

  return (
    <CustomLink
      to={`${ROUTE_VIEW_CONTEST.replace("[chain]", chain?.name.toLowerCase() ?? "").replace(
        "[address]",
        contestConfig.address,
      )}`}
      className="text-positive-11 font-bold text-[16px]"
    >
      {contestName}
    </CustomLink>
  );
};

export default SubmissionPageDesktopBodyContentInfoContestName;
