import useContestConfigStore from "@hooks/useContestConfig/store";
import { VOTE_AND_EARN_VERSION } from "@hooks/useUser/utils";
import { compareVersions } from "compare-versions";
import { useShallow } from "zustand/shallow";
import ContestParametersVotingCurrent from "./components/Current";
import ContestParametersVotingLegacy from "./components/Legacy";

const ContestParametersVoting = () => {
  const version = useContestConfigStore(useShallow(state => state.contestConfig.version));
  const isVoteAndEarnVersion = compareVersions(version, VOTE_AND_EARN_VERSION) >= 0;

  switch (isVoteAndEarnVersion) {
    case true:
      return <ContestParametersVotingCurrent />;
    case false:
      return <ContestParametersVotingLegacy />;
  }
};

export default ContestParametersVoting;
