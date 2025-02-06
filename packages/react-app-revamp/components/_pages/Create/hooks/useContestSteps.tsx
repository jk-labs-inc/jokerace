import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateContestConfirm from "../pages/ContestConfirm";
import CreateContestEntries from "../pages/ContestEntries";
import CreateContestMonetization from "../pages/ContestMonetization";
import CreateContestRules from "../pages/ContestRules/components";
import CreateContestTiming from "../pages/ContestTiming";
import CreateContestTypes from "../pages/ContestTypes";
import CreateContestVoting from "../pages/ContestVoting";
import { ContestType, StepTitle } from "../types";

export const useContestSteps = () => {
  const { contestType } = useDeployContestStore(state => state);

  const getStepsForContestType = () => {
    const baseSteps = [
      { title: StepTitle.Type, content: <CreateContestTypes /> },
      { title: StepTitle.Monetization, content: <CreateContestMonetization /> },
      { title: StepTitle.Timing, content: <CreateContestTiming /> },
      { title: StepTitle.Entries, content: <CreateContestEntries /> },
      { title: StepTitle.Rules, content: <CreateContestRules /> },
      { title: StepTitle.Confirm, content: <CreateContestConfirm /> },
    ];

    if (contestType === ContestType.EntryContest) {
      return [baseSteps[0], { title: StepTitle.Voting, content: <CreateContestVoting /> }, ...baseSteps.slice(1)];
    }

    return baseSteps;
  };

  return {
    steps: getStepsForContestType(),
  };
};
