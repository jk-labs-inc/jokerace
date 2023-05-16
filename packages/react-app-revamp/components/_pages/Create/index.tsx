import Stepper from "./components/Stepper";
import CreateContestPrompt from "./pages/ContestPrompt";
import CreateContestSummary from "./pages/ContestSummary";
import CreateContestTiming from "./pages/ContestTiming";
import CreateContestTitle from "./pages/ContestTitle";
import CreateContestType from "./pages/ContestType";

const CreateFlow = () => {
  const steps = [
    { title: "contest type", content: <CreateContestType /> },
    { title: "contest title", content: <CreateContestTitle /> },
    { title: "summary", content: <CreateContestSummary /> },
    { title: "prompt", content: <CreateContestPrompt /> },
    { title: "timing", content: <CreateContestTiming /> },
    { title: "summary", content: <div>ccc</div> },
    { title: "contest type", content: <div>aa</div> },
    { title: "contest title", content: <div>bb</div> },
    { title: "summary", content: <div>ccc</div> },
  ];

  return (
    <div className="pl-[80px] pr-[60px]">
      <Stepper steps={steps} />
    </div>
  );
};

export default CreateFlow;
