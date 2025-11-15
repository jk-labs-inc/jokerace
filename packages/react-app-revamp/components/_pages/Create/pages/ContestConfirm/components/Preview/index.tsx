import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { EntryPreviewConfig, MetadataField } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { FC, useMemo } from "react";
import CreateContestConfirmLayout from "../Layout";
interface CreateContestConfirmPreviewProps {
  entryPreviewConfig: EntryPreviewConfig;
  metadataFields: MetadataField[];
  step: number;
  onClick?: (stepIndex: number) => void;
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
        return "all entries require a title";
      case EntryPreview.IMAGE:
        return "all entries require an image";
      case EntryPreview.IMAGE_AND_TITLE:
        return "all entries require an image and title";
      case EntryPreview.TWEET:
        return "all entries require a tweet";
    }
  }, [entryPreviewConfig.preview]);

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
          <li className="text-[16px] text-neutral-11">{determineMetadataFieldsText}</li>
        </ul>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmPreview;
