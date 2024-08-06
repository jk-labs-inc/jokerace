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
        <div class="flex flex-col gap-2">
          <p class="text-neutral-11 font-bold m-0">${field.prompt}</p>
          <p class="text-neutral-11 m-0">${field.inputValue}</p>
        </div>
    `,
    )
    .join("");

  const divider =
    proposalContent.trim().length > 0
      ? '<div class="bg-gradient-to-r from-neutral-7 w-full h-[1px] mt-6 mb-4"></div>'
      : "";

  return `
        ${divider}
        <div class="flex flex-col gap-6">
          ${fieldHTMLs}
        </div>
    `;
}
