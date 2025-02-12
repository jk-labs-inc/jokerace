import { Radio, RadioGroup } from "@headlessui/react";
import { EntryPreview, useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";

const ContestEntriesPreview = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { entryPreviewConfig, setEntryPreviewConfig } = useDeployContestStore(state => state);

  const handlePreviewChange = (value: EntryPreview) => {
    setEntryPreviewConfig({ ...entryPreviewConfig, preview: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11 font-bold">what kind of preview should a player enter?</p>
      <RadioGroup value={entryPreviewConfig.preview} onChange={handlePreviewChange}>
        <div className="flex flex-col gap-4">
          <Radio value={EntryPreview.TITLE}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-secondary-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className={`text-[20px] ${checked ? "text-neutral-11" : "text-neutral-9"}`}>
                    a title (recommended for most contests)
                  </p>
                </div>
              </div>
            )}
          </Radio>
          <Radio value={EntryPreview.IMAGE}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-secondary-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className={`text-[20px] ${checked ? "text-neutral-11" : "text-neutral-9"}`}>
                    an image {isMobile ? "" : "(recommended for meme contests, art contests, design contests, etc)"}
                  </p>
                </div>
              </div>
            )}
          </Radio>
          <Radio value={EntryPreview.IMAGE_AND_TITLE}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-secondary-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className={`text-[20px] ${checked ? "text-neutral-11" : "text-neutral-9"}`}>
                    an image + title {isMobile ? "" : "(recommended for competitions between projects with logos)"}
                  </p>
                </div>
              </div>
            )}
          </Radio>
          <Radio value={EntryPreview.TWEET}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-secondary-11  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className={`text-[20px] ${checked ? "text-neutral-11" : "text-neutral-9"}`}>
                    a tweet {isMobile ? "" : "(recommended for contests on x.com posts)"}
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

export default ContestEntriesPreview;
