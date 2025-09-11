import { useContestStore } from "@hooks/useContest/store";
import { VOTE_AND_EARN_VERSION } from "@hooks/useUser/utils";
import { compareVersions } from "compare-versions";
import { useShallow } from "zustand/shallow";
import ContestParametersSubmissionsCurrent from "./components/Current";
import ContestParametersSubmissionsLegacy from "./components/Legacy";

const ContestParametersSubmissions = () => {
  const version = useContestStore(useShallow(state => state.version));
  const isVoteAndEarnVersion = compareVersions(version, VOTE_AND_EARN_VERSION) >= 0;

  switch (isVoteAndEarnVersion) {
    case true:
      return <ContestParametersSubmissionsCurrent />;
    case false:
      return <ContestParametersSubmissionsLegacy />;
  }
};

export default ContestParametersSubmissions;
