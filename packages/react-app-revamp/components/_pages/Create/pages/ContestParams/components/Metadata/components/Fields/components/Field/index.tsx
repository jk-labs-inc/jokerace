import { TrashIcon } from "@heroicons/react/24/outline";
import { MetadataField, useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ContestParamsMetadataFieldsDropdown from "../../../Dropdown";
import { fieldsDropdownOptions, metadataFields } from "../../utils";

interface ContestParamsMetadataFieldProps {
  index: number;
  field: MetadataField;
}

const ContestParamsMetadataField: FC<ContestParamsMetadataFieldProps> = ({ index, field }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { setMetadataFields } = useDeployContestStore();
  const [fadeBg, setFadeBg] = useState(false);

  const handleDropdownChange = (option: string) => {
    const selectedField = metadataFields.find(f => f.metadataType === option);
    if (selectedField) {
      setMetadataFields(prevFields => {
        const newFields = [...prevFields];
        newFields[index] = {
          ...selectedField,
          prompt: "",
        };
        return newFields;
      });
    }
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetadataFields(prevFields => {
      const newFields = [...prevFields];
      newFields[index] = { ...newFields[index], prompt: event.target.value };
      return newFields;
    });
  };

  const handleRemoveField = () => {
    setMetadataFields(prevFields => prevFields.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-8 w-full md:w-[502px]">
      <div className="flex justify-between items-center">
        <p className="text-[16px] text-neutral-14 font-bold uppercase">field #{index + 1}</p>
        <TrashIcon
          onClick={handleRemoveField}
          className="text-negative-11 w-6 h-6 hover:text-negative-10 transition-colors duration-300 ease-in-out cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-[16px] text-neutral-11 font-bold uppercase">field type</p>
          <ContestParamsMetadataFieldsDropdown
            options={fieldsDropdownOptions}
            defaultOption={fieldsDropdownOptions.find(o => o.value === field.metadataType)!}
            onChange={handleDropdownChange}
            onMenuStateChange={setFadeBg}
          />
        </div>
        <div className={`${fadeBg ? "opacity-30" : "opacity-100"}`}>
          {isMobile ? field.description.mobile : field.description.desktop}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[16px] text-neutral-11 font-bold uppercase">field prompt</p>
        <input
          value={field.prompt}
          onChange={handlePromptChange}
          className="text-[16px] md:text-[20px] w-full md:w-[502px] border-b border-neutral-11 placeholder-neutral-10 placeholder-bold bg-transparent focus:outline-none"
          placeholder={field.promptLabel}
        />
      </div>
    </div>
  );
};

export default ContestParamsMetadataField;
