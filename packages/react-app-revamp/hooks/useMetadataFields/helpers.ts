import { MetadataField } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { ParsedMetadataField } from "./store";

export function parseMetadataFieldsSchema(schema: string): ParsedMetadataField[] {
  try {
    const parsedSchema = JSON.parse(schema) as Record<string, string | string[]>;

    return Object.entries(parsedSchema).flatMap(([metadataType, prompt]) => {
      if (Array.isArray(prompt)) {
        return prompt.map(p => ({
          metadataType: metadataType as MetadataField["metadataType"],
          prompt: p,
        }));
      } else {
        return [
          {
            metadataType: metadataType as MetadataField["metadataType"],
            prompt: prompt,
          },
        ];
      }
    });
  } catch (error) {
    console.error("Error parsing metadataFieldsSchema:", error);
    return [];
  }
}
