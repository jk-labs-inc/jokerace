import { MetadataFieldWithInput } from "@hooks/useMetadataFields/store";
import { parseEther } from "viem";

export function processFieldInputs(fieldInputs: MetadataFieldWithInput[]) {
  const fieldsMetadata = {
    addressArray: [] as `0x${string}`[],
    stringArray: [] as string[],
    uintArray: [] as bigint[],
  };

  fieldInputs.forEach(field => {
    switch (field.metadataType) {
      case "address":
        fieldsMetadata.addressArray.push(field.inputValue as `0x${string}`);
        break;
      case "string":
        fieldsMetadata.stringArray.push(field.inputValue);
        break;
      case "uint256":
        fieldsMetadata.uintArray.push(parseEther(field.inputValue));
        break;
      default:
        console.warn(`Unsupported metadata type: ${field.metadataType}`);
    }
  });

  return fieldsMetadata;
}

export function generateFieldInputsHTML(proposalContent: string, fieldInputs: MetadataFieldWithInput[]): string {
  if (fieldInputs.length === 0) return "";

  const fieldHTMLs = fieldInputs
    .map(
      field => `
        <div class="flex flex-col gap-4">
          <p class="text-neutral-11 italic m-0">${field.prompt}</p>
          <p class="text-neutral-11 m-0">${field.inputValue}</p>
        </div>
    `,
    )
    .join("");

  const divider = proposalContent.trim().length > 0 ? '<hr class="border-neutral-11 bg-neutral-11 mt-6 mb-6">' : "";

  return `
        ${divider}
        <div class="flex flex-col gap-6">
          ${fieldHTMLs}
        </div>
    `;
}
