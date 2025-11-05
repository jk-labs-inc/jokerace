import CreateContestConfirm from "../pages/ContestConfirm";
import CreateContestEntries from "../pages/ContestEntries";
import CreateContestMonetization from "../pages/ContestMonetization";
import CreateContestRewards from "../pages/ContestRewards";
import CreateContestRules from "../pages/ContestRules/components";
import CreateContestTiming from "../pages/ContestTiming";
import CreateContestTypes from "../pages/ContestTypes";
import { StepTitle } from "../types";

export const useContestSteps = () => {
  const stepReferences = {
    ContestType: 0,
    ContestMonetization: 1,
    ContestTiming: 2,
    ContestEntries: 3,
    ContestRewards: 4,
    ContestRules: 5,
    Confirm: 6,
  };

  const steps = [
    { title: StepTitle.Type, content: <CreateContestTypes /> },
    { title: StepTitle.Monetization, content: <CreateContestMonetization /> },
    { title: StepTitle.Timing, content: <CreateContestTiming /> },
    { title: StepTitle.Entries, content: <CreateContestEntries /> },
    { title: StepTitle.Rewards, content: <CreateContestRewards /> },
    { title: StepTitle.Rules, content: <CreateContestRules /> },
    { title: StepTitle.Confirm, content: <CreateContestConfirm /> },
  ];

  return {
    steps,
    stepReferences,
  };
};
