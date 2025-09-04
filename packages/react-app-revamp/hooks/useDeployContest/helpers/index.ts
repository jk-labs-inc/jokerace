import { EntryPreviewConfig, MetadataField } from "../slices/contestMetadataSlice";

export function createMetadataFieldsSchema(
  metadataFields: MetadataField[],
  entryPreviewConfig: EntryPreviewConfig,
): string {
  // start with an object that has a 'string' property initialized with the entry preview prompt
  const initialSchema: Record<string, string | string[]> = {
    string: getEntryPreviewPrompt(entryPreviewConfig),
  };

  const schema = metadataFields
    .filter(field => field.prompt.trim() !== "")
    .reduce<Record<string, string | string[]>>((acc, field) => {
      const metadataType = field.metadataType;
      const prompt = field.prompt.trim();

      if (acc[metadataType]) {
        if (Array.isArray(acc[metadataType])) {
          (acc[metadataType] as string[]).push(prompt);
        } else {
          acc[metadataType] = [acc[metadataType] as string, prompt];
        }
      } else {
        acc[metadataType] = prompt;
      }

      return acc;
    }, initialSchema);

  // ensure 'string' is always an array
  if (!Array.isArray(schema.string)) {
    schema.string = [schema.string];
  }

  return JSON.stringify(schema);
}

export function getEntryPreviewPrompt(config: EntryPreviewConfig): string {
  const { preview, isAdditionalDescriptionEnabled } = config;
  const descriptionSuffix = isAdditionalDescriptionEnabled ? "_DESCRIPTION_ENABLED" : "_DESCRIPTION_NOT_ENABLED";
  return `${preview}${descriptionSuffix}`;
}
