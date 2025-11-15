import CreateSwitch from "@components/_pages/Create/components/Switch";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/shallow";

const RequireTitleSetting = () => {
  const { entryPreviewConfig, setEntryPreviewConfig } = useDeployContestStore(
    useShallow(state => ({
      entryPreviewConfig: state.entryPreviewConfig,
      setEntryPreviewConfig: state.setEntryPreviewConfig,
    })),
  );

  const handleRequireTitleChange = (checked: boolean) => {
    setEntryPreviewConfig({ ...entryPreviewConfig, isTitleRequired: checked });
  };

  return (
    <div className="flex items-center gap-6">
      <CreateSwitch checked={entryPreviewConfig.isTitleRequired} onChange={handleRequireTitleChange} />
      <p className="text-base text-neutral-11">require titles for all entries</p>
    </div>
  );
};

export default RequireTitleSetting;
