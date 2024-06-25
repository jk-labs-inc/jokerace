import { MerkleKey, SubmissionType, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle, VotingMerkle } from "@hooks/useDeployContest/types";
import { useMediaQuery } from "react-responsive";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import CreateSubmissionTabContent from "./components/SubmissionTabContent";
import CreateSubmissionTabMessage from "./components/SubmissionTabMessage";
import CreateSubmissionType from "./components/SubmissionType";

const CreateContestSubmissions = () => {
  const { step, submissionTypeOption, setSubmissionMerkle, setVotingMerkle } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const setAllSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled", "manual"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const setAllVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled", "manual"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  // Handle next step for same as voters option
  const handleNextStep = () => {
    setAllSubmissionMerkles(null);
    setAllVotingMerkles(null);
    onNextStep();
  };

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-primary-10 font-bold">Who can submit?</p>
        </div>
        <div className="grid gap-10 col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
          <div className="flex flex-col">
            <div className="flex flex-col gap-11">
              <div className="flex flex-col gap-8">
                <CreateSubmissionType />
                <CreateSubmissionTabMessage />
              </div>
            </div>

            {submissionTypeOption.value === SubmissionType.DifferentFromVoters ? (
              <CreateSubmissionTabContent />
            ) : (
              <div className="mt-16">
                <CreateNextButton step={step + 1} onClick={handleNextStep} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestSubmissions;
