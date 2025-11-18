import { EntryPreview, EntryPreviewConfig, MetadataField } from "../slices/contestMetadataSlice";

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
  const { preview } = config;
  const descriptionSuffix = "_DESCRIPTION_ENABLED";

  let basePreview = preview;

  if (config.isTitleRequired) {
    if (preview === EntryPreview.IMAGE) {
      basePreview = EntryPreview.IMAGE_AND_TITLE;
    } else if (preview === EntryPreview.TWEET) {
      basePreview = EntryPreview.TWEET_AND_TITLE;
    }
  }

  const fullPrompt = `${basePreview}${descriptionSuffix}`;

  return fullPrompt;
}
