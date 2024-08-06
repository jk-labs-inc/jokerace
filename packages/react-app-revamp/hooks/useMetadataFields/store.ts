import { MetadataField } from "@hooks/useDeployContest/store";
import { create } from "zustand";

export interface ParsedMetadataField {
  metadataType: MetadataField["metadataType"];
  prompt: string;
}

export interface MetadataFieldWithInput extends ParsedMetadataField {
  inputValue: string;
}

interface MetadataStore {
  fields: MetadataFieldWithInput[];
  setFields: (fields: ParsedMetadataField[]) => void;
  setInputValue: (index: number, value: string) => void;
}

export const useMetadataStore = create<MetadataStore>(set => ({
  fields: [],
  setFields: fields =>
    set({
      fields: fields.map(field => ({ ...field, inputValue: "" })),
    }),
  setInputValue: (index, value) =>
    set(state => ({
      fields: state.fields.map((field, i) => (i === index ? { ...field, inputValue: value } : field)),
    })),
}));
