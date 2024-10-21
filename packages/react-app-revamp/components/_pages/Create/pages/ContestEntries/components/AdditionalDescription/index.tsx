import { Radio, RadioGroup } from "@headlessui/react";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";

const ContestEntriesAdditionalDescription = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { entryPreviewConfig, setEntryPreviewConfig } = useDeployContestStore(state => state);

  const handleAddDescriptionChange = (value: boolean) => {
    setEntryPreviewConfig({ ...entryPreviewConfig, isAdditionalDescriptionEnabled: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11 font-bold">
        can players include an “additional description” for their preview?
      </p>
      <RadioGroup value={entryPreviewConfig.isAdditionalDescriptionEnabled} onChange={handleAddDescriptionChange}>
        <div className="flex flex-col gap-4">
          <Radio value={true}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-secondary-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className={`text-[20px] ${checked ? "text-secondary-11" : "text-neutral-9"}`}>yes (recommended)</p>
                </div>
              </div>
            )}
          </Radio>
          <Radio value={false}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-secondary-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className={`text-[20px] ${checked ? "text-secondary-11" : "text-neutral-9"}`}>
                    no{" "}
                    {isMobile
                      ? ""
                      : "(select if you *only* want players to enter a title, image, title + image, or tweet)"}
                  </p>
                </div>
              </div>
            )}
          </Radio>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ContestEntriesAdditionalDescription;
