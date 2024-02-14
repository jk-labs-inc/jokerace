import { usePageActionStore } from "@hooks/useCreateFlowAction/store";
import Stepper from "./components/Stepper";
import CreateContestParams from "./pages/ContestParams";
import ContestPlay from "./pages/ContestPlay";
import CreateContestPrompt from "./pages/ContestPrompt";
import CreateContestStart, { useCreateContestStartStore } from "./pages/ContestStart";
import CreateContestSubmissions from "./pages/ContestSubmission";
import CreateContestSummary from "./pages/ContestSummary";
import CreateContestTiming from "./pages/ContestTiming";
import CreateContestTitle from "./pages/ContestTitle";
import CreateContestType from "./pages/ContestType";
import CreateContestVoting from "./pages/ContestVoting";

const steps = [
  { title: "title", content: <CreateContestTitle /> },
  { title: "description", content: <CreateContestPrompt /> },
  { title: "summary", content: <CreateContestSummary /> },
  { title: "tag", content: <CreateContestType /> },
  { title: "timing", content: <CreateContestTiming /> },
  { title: "submissions", content: <CreateContestSubmissions /> },
  { title: "voting", content: <CreateContestVoting /> },
  { title: "parameters", content: <CreateContestParams /> },
];

const CreateFlow = () => {
  const pageAction = usePageActionStore(state => state.pageAction);
  const { startContest, setStartContest } = useCreateContestStartStore(state => state);

  const handleStartCreating = () => {
    setStartContest(true);
  };

  return (
    <div className="pl-[24px] pr-[20px] lg:pl-[120px] lg:pr-[60px]">
      {pageAction === "create" && !startContest ? (
        <CreateContestStart onClick={handleStartCreating} />
      ) : pageAction === "create" && startContest ? (
        <Stepper steps={steps} />
      ) : (
        <ContestPlay />
      )}
    </div>
  );
};

export default CreateFlow;
