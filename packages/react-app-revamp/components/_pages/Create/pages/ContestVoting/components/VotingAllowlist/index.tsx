import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CSVEditor from "@components/_pages/Create/components/CSVEditor";
import FileUpload from "@components/_pages/Create/components/FileUpload";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const CreateVotingAllowlist = () => {
  const { step } = useDeployContestStore(state => state);
  return (
    <div className="mt-5 ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[24px] font-bold text-primary-10">who can vote?</p>
        <p className="text-[16px] text-neutral-11">
          copy-paste allowlist into preview box (up to 100 line items) or upload a csv below <br />
          (no limit on line items).
        </p>
      </div>
      <CSVEditor />
      <div className="mt-5">
        <FileUpload />
      </div>
      <div className="mt-8">
        <CreateNextButton step={step + 1} />
      </div>
    </div>
  );
};

export default CreateVotingAllowlist;
