import CreateContestConfirm from "../pages/ContestConfirm";
import CreateContestEntries from "../pages/ContestEntries";
import CreateContestRewards from "../pages/ContestRewards";
import CreateContestRules from "../pages/ContestRules/components";
import CreateContestTiming from "../pages/ContestTiming";
import CreateContestVoting from "../pages/ContestVoting";
import { StepTitle } from "../types";

export const useContestSteps = () => {
  const stepReferences = {
    ContestEntries: 0,
    ContestVoting: 1,
    ContestTiming: 2,
    ContestRewards: 3,
    ContestRules: 4,
    Confirm: 5,
  };

  const steps = [
    { title: StepTitle.Entries, content: <CreateContestEntries /> },
    { title: StepTitle.Voting, content: <CreateContestVoting /> },
    { title: StepTitle.Timing, content: <CreateContestTiming /> },
    { title: StepTitle.Rewards, content: <CreateContestRewards /> },
    { title: StepTitle.Rules, content: <CreateContestRules /> },
    { title: StepTitle.Confirm, content: <CreateContestConfirm /> },
  ];

  return {
    steps,
    stepReferences,
  };
};
