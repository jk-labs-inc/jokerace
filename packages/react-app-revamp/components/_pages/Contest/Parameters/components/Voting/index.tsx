import { useContestStore } from "@hooks/useContest/store";
import { VOTE_AND_EARN_VERSION } from "@hooks/useUser/utils";
import { compareVersions } from "compare-versions";
import { useShallow } from "zustand/shallow";
import ContestParametersVotingCurrent from "./components/Current";
import ContestParametersVotingLegacy from "./components/Legacy";

const ContestParametersVoting = () => {
  const version = useContestStore(useShallow(state => state.version));
  const isVoteAndEarnVersion = compareVersions(version, VOTE_AND_EARN_VERSION) >= 0;

  switch (isVoteAndEarnVersion) {
    case true:
      return <ContestParametersVotingCurrent />;
    case false:
      return <ContestParametersVotingLegacy />;
  }
};

export default ContestParametersVoting;
