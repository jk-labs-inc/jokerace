import { EntryPreview, EntryPreviewConfig, MetadataField } from "@hooks/useDeployContest/store";
import { FC, useMemo } from "react";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";
interface CreateContestConfirmPreviewProps {
  entryPreviewConfig: EntryPreviewConfig;
  metadataFields: MetadataField[];
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmPreview: FC<CreateContestConfirmPreviewProps> = ({
  entryPreviewConfig,
  metadataFields,
  step,
  onClick,
}) => {
  const determinePreviewText = useMemo(() => {
    switch (entryPreviewConfig.preview) {
      case EntryPreview.TITLE:
        return "title";
      case EntryPreview.IMAGE:
        return "image";
      case EntryPreview.IMAGE_AND_TITLE:
        return "image and title";
      case EntryPreview.TWEET:
        return "tweet";
    }
  }, [entryPreviewConfig.preview]);

  const determineAdditionalDescriptionText = useMemo(() => {
    if (entryPreviewConfig.isAdditionalDescriptionEnabled) {
      return "contestants can include additional description";
    }
    return "contestants can't include additional description";
  }, [entryPreviewConfig.isAdditionalDescriptionEnabled]);

  const determineMetadataFieldsText = useMemo(() => {
    if (!metadataFields?.length) {
      return "0 additional fields required";
    }

    const fieldsWithPrompts = metadataFields.filter(field => field.prompt);
    return `${fieldsWithPrompts.length} additional field${fieldsWithPrompts.length === 1 ? "" : "s"} required`;
  }, [metadataFields]);

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2">
        <p className="text-neutral-9 text-[12px] font-bold uppercase">format</p>
        <ul className="flex flex-col list-disc pl-6">
          <li className="text-[16px] text-neutral-11">{determinePreviewText}</li>
          <li className="text-[16px] text-neutral-11">{determineAdditionalDescriptionText}</li>
          <li className="text-[16px] text-neutral-11">{determineMetadataFieldsText}</li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmPreview;
