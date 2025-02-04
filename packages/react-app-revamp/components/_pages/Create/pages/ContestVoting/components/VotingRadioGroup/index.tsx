import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { VotingMerkle } from "@hooks/useDeployContest/types";
import { useEffect, useState } from "react";
import CreateVotingRequirements from "../VotingRequirements";
import CreateVotingCSVUploader from "../VotingUploadCsv";
import { useMediaQuery } from "react-responsive";
import { Radio, RadioGroup } from "@headlessui/react";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";

const CreateVotingRadioGroup = () => {
  const { setVotingTab, votingTab, setVotingMerkle, step, votingAllowlist } = useDeployContestStore(state => state);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isNextClicked, setIsNextClicked] = useState(false);

  const onVotingTabChange = (value: number) => {
    setVotingTab(value);
    setAllVotingMerkles(null);
    setIsNextClicked(false);
  };

  const setAllVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const tabOptions = [
    {
      label: "upload a spreadsheet",
      mobileLabel: "upload csv",
      content: <CreateVotingCSVUploader isNextClicked={isNextClicked} />,
    },
    {
      label: "use presets",
      mobileLabel: "use presets",
      content: <CreateVotingRequirements isNextClicked={isNextClicked} />,
    },
  ];

  return (
    <div className="flex flex-col gap-16">
      <RadioGroup value={votingTab} onChange={onVotingTabChange}>
        <div className="flex flex-col gap-6">
          {tabOptions.map((option, index) => (
            <Radio key={index} value={index}>
              {({ checked }) => (
                <div className={`transition-all duration-200 ${checked ? "opacity-100" : "opacity-50 cursor-pointer"}`}>
                  <div className="flex gap-4 items-center">
                    <div
                      className={`flex items-center justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                        checked ? "bg-secondary-11 border-0" : ""
                      }`}
                    ></div>
                    <div className="flex flex-col">
                      <p className={`text-[20px] ${checked ? "text-neutral-11" : "text-neutral-9"}`}>
                        {isMobile ? option.mobileLabel : option.label}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-4 transition-opacity duration-200 ${checked ? "opacity-100" : "opacity-50 pointer-events-none"}`}
                  >
                    {option.content}
                  </div>
                </div>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>
      <CreateNextButton
        step={step + 1}
        onClick={() => setIsNextClicked(true)}
        isDisabled={votingTab === 0 && Object.keys(votingAllowlist.csv).length === 0}
      />
    </div>
  );
};

export default CreateVotingRadioGroup;
