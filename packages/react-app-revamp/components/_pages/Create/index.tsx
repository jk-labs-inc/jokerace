import { usePageActionStore } from "@hooks/useCreateFlowAction/store";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Stepper from "./components/Stepper";
import CreateContestConfirm from "./pages/ContestConfirm";
import CreateContestMonetization from "./pages/ContestMonetization";
import CreateContestParams from "./pages/ContestParams";
import CreateContestPrompt from "./pages/ContestPrompt";
import CreateContestStart, { useCreateContestStartStore } from "./pages/ContestStart";
import CreateContestSubmissions from "./pages/ContestSubmission";
import CreateContestSummary from "./pages/ContestSummary";
import CreateContestTiming from "./pages/ContestTiming";
import CreateContestTitle from "./pages/ContestTitle";
import CreateContestType from "./pages/ContestType";
import CreateContestTemplate from "./pages/ContestUseTemplate";
import CreateContestVoting from "./pages/ContestVoting";
import { useEffect } from "react";

export enum StepTitle {
  Title = "title",
  Description = "description",
  Summary = "summary",
  Tag = "tag",
  Timing = "timing",
  Submissions = "submissions",
  Voting = "voting",
  Monetization = "monetization",
  Customization = "customization",
  Confirm = "confirm!",
}

export const steps = [
  { title: StepTitle.Title, content: <CreateContestTitle /> },
  { title: StepTitle.Description, content: <CreateContestPrompt /> },
  { title: StepTitle.Summary, content: <CreateContestSummary /> },
  { title: StepTitle.Tag, content: <CreateContestType /> },
  { title: StepTitle.Timing, content: <CreateContestTiming /> },
  { title: StepTitle.Submissions, content: <CreateContestSubmissions /> },
  { title: StepTitle.Voting, content: <CreateContestVoting /> },
  { title: StepTitle.Monetization, content: <CreateContestMonetization /> },
  { title: StepTitle.Customization, content: <CreateContestParams /> },
  { title: StepTitle.Confirm, content: <CreateContestConfirm /> },
];

const CreateFlow = () => {
  const { startContest, startContestWithTemplate, setStartContest, setStartContestWithTemplate } =
    useCreateContestStartStore(state => state);
  const { reset } = useDeployContestStore(state => state);

  useEffect(() => {
    setStartContest(false);
    setStartContestWithTemplate(false);
    reset();
  }, []);

  const handleStartCreating = (withTemplate: boolean) => {
    reset();
    if (withTemplate) {
      setStartContestWithTemplate(true);
    } else {
      setStartContest(true);
    }
  };

  if (!startContest && !startContestWithTemplate) {
    return (
      <div className="pl-4 pr-4 lg:pl-[120px] lg:pr-[60px]">
        <CreateContestStart
          onCreateContest={() => handleStartCreating(false)}
          onCreateContestWithTemplate={() => handleStartCreating(true)}
        />
      </div>
    );
  }

  if (startContestWithTemplate) {
    return <CreateContestTemplate />;
  }

  return (
    <div className="pl-4 pr-4 lg:pl-[120px] lg:pr-[60px]">
      <Stepper steps={steps} />
    </div>
  );
};

export default CreateFlow;
