import CreateSwitch from "@components/_pages/Create/components/Switch";
import ContestParamsMetadataFields from "@components/_pages/Create/pages/ContestParams/components/Metadata/components/Fields";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/shallow";

const RequireAdditionalFieldsSetting = () => {
  const { metadataToggle, setMetadataToggle } = useDeployContestStore(
    useShallow(state => ({
      metadataToggle: state.metadataToggle,
      setMetadataToggle: state.setMetadataToggle,
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <CreateSwitch checked={metadataToggle} onChange={setMetadataToggle} />
        <p className="text-base text-neutral-11">require additional fields</p>
      </div>
      {metadataToggle ? <ContestParamsMetadataFields /> : null}
    </div>
  );
};

export default RequireAdditionalFieldsSetting;
