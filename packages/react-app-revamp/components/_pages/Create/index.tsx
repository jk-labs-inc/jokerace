import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import Stepper from "./components/Stepper";
import { useContestSteps } from "./hooks/useContestSteps";
import CreateContestStart, { useCreateContestStartStore } from "./pages/ContestStart";
import CreateContestTemplate from "./pages/ContestUseTemplate";

const CreateFlow = () => {
  const { startContest, startContestWithTemplate, setStartContest, setStartContestWithTemplate } =
    useCreateContestStartStore(state => state);
  const { reset } = useDeployContestStore(state => state);
  const { steps } = useContestSteps();

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
