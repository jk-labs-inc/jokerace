import { useContestStore } from "@hooks/useContest/store";
import { MetadataField } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { compareVersions } from "compare-versions";
import { useEffect } from "react";
import { Abi } from "viem";
import { useReadContract } from "wagmi";
import { useShallow } from "zustand/shallow";
import { ParsedMetadataField, useMetadataStore } from "./store";

const METADATA_FIELDS_VERSION = "4.31";

function parseMetadataFieldsSchema(schema: string): ParsedMetadataField[] {
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

const useMetadataFields = () => {
  const setFields = useMetadataStore(useShallow(state => state.setFields));
  const { contestAbi, version, contestInfoData } = useContestStore(
    useShallow(state => ({
      contestAbi: state.contestAbi,
      version: state.version,
      contestInfoData: state.contestInfoData,
    })),
  );

  const {
    data: metadataSchema,
    isError: isMetadataError,
    isLoading: isMetadataLoading,
  } = useReadContract({
    abi: contestAbi as Abi,
    address: contestInfoData.contestAddress as `0x${string}`,
    chainId: contestInfoData.contestChainId,
    functionName: "metadataFieldsSchema",
    query: {
      enabled: Boolean(compareVersions(version, METADATA_FIELDS_VERSION) >= 0),
    },
  });

  useEffect(() => {
    if (typeof metadataSchema === "string") {
      const parsedFields = parseMetadataFieldsSchema(metadataSchema);
      setFields(parsedFields);
    } else if (metadataSchema !== undefined || isMetadataError) {
      console.error("Unexpected data type or error from metadataFieldsSchema");
      setFields([]);
    }
  }, [metadataSchema, isMetadataError, setFields]);

  return {
    isLoading: isMetadataLoading,
    isError: isMetadataError,
  };
};

export default useMetadataFields;
