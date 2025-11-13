import AnyoneCanSubmitSetting from "./components/AnyoneCanSubmitSetting";
import RequireAdditionalFieldsSetting from "./components/RequireAdditionalFieldsSetting";
import RequireTitleSetting from "./components/RequireTitleSetting";

const CreateContestEntriesEntrySettings = () => {
  return (
    <div className="flex flex-col gap-8 pl-6">
      <AnyoneCanSubmitSetting />
      <RequireTitleSetting />
      <RequireAdditionalFieldsSetting />
    </div>
  );
};

export default CreateContestEntriesEntrySettings;
