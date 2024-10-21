import { useMetadataStore } from "@hooks/useMetadataFields/store";
import { isEntryPreviewPrompt } from "../../utils";
import DialogModalSendProposalMetadataField from "./components/MetadataField";

const DialogModalSendProposalMetadataFields = () => {
  const { fields: metadataFields } = useMetadataStore(state => state);
  const hasEntryPreview = metadataFields.length > 0 && isEntryPreviewPrompt(metadataFields[0].prompt);
  const filteredFields = hasEntryPreview ? metadataFields.slice(1) : metadataFields;

  if (filteredFields.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[16px] font-bold text-neutral-14 uppercase">additional fields:</p>
      {filteredFields.map((field, index) => (
        <DialogModalSendProposalMetadataField
          key={hasEntryPreview ? index + 1 : index}
          index={hasEntryPreview ? index + 1 : index}
          metadataField={field}
        />
      ))}
    </div>
  );
};

export default DialogModalSendProposalMetadataFields;
