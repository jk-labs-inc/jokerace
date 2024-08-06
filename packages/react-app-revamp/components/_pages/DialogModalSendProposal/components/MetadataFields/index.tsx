import { useMetadataStore } from "@hooks/useMetadataFields/store";
import DialogModalSendProposalMetadataField from "./components/MetadataField";

const DialogModalSendProposalMetadataFields = () => {
  const { fields: metadataFields } = useMetadataStore(state => state);
  return (
    <div className="flex flex-col gap-8">
      <p className="text-[16px] font-bold text-neutral-11 uppercase">additional fields:</p>
      {metadataFields.map((field, index) => (
        <DialogModalSendProposalMetadataField key={index} index={index} metadataField={field} />
      ))}
    </div>
  );
};

export default DialogModalSendProposalMetadataFields;
