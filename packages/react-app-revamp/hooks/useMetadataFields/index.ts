import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { MetadataField } from "@hooks/useDeployContest/store";
import { useQuery } from "@tanstack/react-query";
import { compareVersions } from "compare-versions";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Abi } from "viem";
import { useReadContract } from "wagmi";
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
  const setFields = useMetadataStore(state => state.setFields);
  const pathname = usePathname();
  const { address: contestAddress, chainName: contestChainName } = extractPathSegments(pathname ?? "");
  const contestChainId = chains.find(chain => chain.name.toLowerCase().replace(" ", "") === contestChainName)?.id;

  const { data: contractData, isLoading: isContractDataLoading } = useQuery({
    queryKey: ["contestContract", contestAddress, contestChainId],
    queryFn: () => getContestContractVersion(contestAddress, contestChainId!),
    enabled: Boolean(contestAddress && contestChainId),
  });

  const {
    data: metadataSchema,
    isError,
    isLoading: isMetadataLoading,
  } = useReadContract({
    abi: contractData?.abi as Abi,
    address: contestAddress as `0x${string}`,
    functionName: "metadataFieldsSchema",
    query: {
      enabled: Boolean(contractData && compareVersions(contractData.version, METADATA_FIELDS_VERSION) >= 0),
    },
  });

  useEffect(() => {
    if (typeof metadataSchema === "string") {
      const parsedFields = parseMetadataFieldsSchema(metadataSchema);
      setFields(parsedFields);
    } else if (metadataSchema !== undefined || isError) {
      console.error("Unexpected data type or error from metadataFieldsSchema");
      setFields([]);
    }
  }, [metadataSchema, isError, setFields]);

  return {
    isLoading: isContractDataLoading || isMetadataLoading,
  };
};

export default useMetadataFields;
