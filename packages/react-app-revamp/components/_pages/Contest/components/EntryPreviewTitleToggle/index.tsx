import { verifyEntryPreviewPrompt } from "@components/_pages/DialogModalSendProposal/utils";
import { Switch } from "@headlessui/react";
import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import { FC } from "react";
import { useEntryPreviewTitleToggleStore } from "./store";

const EntryPreviewTitleToggle: FC = () => {
  const { isExpanded, setIsExpanded } = useEntryPreviewTitleToggleStore(state => state);
  const { fields: metadataFieldsConfig } = useMetadataStore(state => state);
  const { enabledPreview } =
    metadataFieldsConfig.length > 0
      ? verifyEntryPreviewPrompt(metadataFieldsConfig[0].prompt)
      : { enabledPreview: null };

  if (!enabledPreview || enabledPreview !== EntryPreview.TITLE) return null;

  return (
    <div className="hidden md:flex gap-4 items-center">
      <Switch
        checked={isExpanded}
        onChange={setIsExpanded}
        className="group relative flex w-12 h-6 cursor-pointer rounded-full bg-neutral-10 transition-colors duration-200 ease-in-out focus:outline-none data-focus:outline-1 data-[focus]:outline-white data-checked:bg-secondary-11"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-neutral-11 ring-0 shadow-lg transition duration-200 ease-in-out group-data-checked:translate-x-7"
        />
      </Switch>
      <p className={`text-[16px] ${isExpanded ? "text-neutral-11" : "text-neutral-9"}`}>expand all</p>
    </div>
  );
};

export default EntryPreviewTitleToggle;
