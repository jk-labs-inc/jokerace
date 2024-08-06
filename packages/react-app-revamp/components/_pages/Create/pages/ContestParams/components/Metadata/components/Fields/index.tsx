import { useDeployContestStore, MetadataField } from "@hooks/useDeployContest/store";
import ContestParamsMetadataField from "./components/Field";
import { useState } from "react";
import { metadataFields } from "./utils";

const ContestParamsMetadataFields = () => {
  const { metadataFields: storeFields, setMetadataFields } = useDeployContestStore();
  const [error, setError] = useState<string | null>(null);

  const addField = () => {
    setMetadataFields(currentFields => {
      const counts = {
        string: 0,
        number: 0,
        address: 0,
      };

      // count existing fields
      currentFields.forEach(field => {
        counts[field.elementType as keyof typeof counts]++;
      });

      // determine which field type to add
      let fieldToAdd: MetadataField | null = null;
      if (counts.string < 10) {
        fieldToAdd = metadataFields[0]; // string field
      } else if (counts.number < 10) {
        fieldToAdd = metadataFields[1]; // integer field
      } else if (counts.address < 10) {
        fieldToAdd = metadataFields[2]; // address field
      }

      if (fieldToAdd) {
        setError(null);
        return [...currentFields, { ...fieldToAdd, prompt: "" }];
      } else {
        setError("Maximum limit reached for all field types.");
        return currentFields;
      }
    });
  };

  return (
    <div className="flex flex-col gap-16">
      {storeFields.map((field, index) => (
        <ContestParamsMetadataField key={index} index={index} field={field} />
      ))}
      <button
        onClick={addField}
        className="w-[216px] h-8 md:h-10 bg-primary-2 rounded-[40px] text-[20px] text-neutral-11 flex items-center justify-center hover:opacity-80 transition-opacity duration-300 ease-in-out"
      >
        + add field
      </button>
      {error && <p className="text-negative-11">{error}</p>}
    </div>
  );
};

export default ContestParamsMetadataFields;
