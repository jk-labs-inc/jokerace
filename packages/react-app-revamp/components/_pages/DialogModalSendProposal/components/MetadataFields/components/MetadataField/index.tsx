import { REGEX_ETHEREUM_ADDRESS } from "@helpers/getAddressProps";
import { MetadataFieldWithInput, useMetadataStore } from "@hooks/useMetadataFields/store";
import { FC, useState, useEffect } from "react";

interface DialogModalSendProposalMetadataFieldProps {
  metadataField: MetadataFieldWithInput;
  index: number;
}

const DialogModalSendProposalMetadataField: FC<DialogModalSendProposalMetadataFieldProps> = ({
  metadataField,
  index,
}) => {
  const { setInputValue } = useMetadataStore(state => state);
  const [error, setError] = useState<string | null>(null);

  const getPlaceholder = (metadataType: string) => {
    switch (metadataType) {
      case "string":
        return "enter text...";
      case "uint256":
        return "1";
      case "address":
        return "0x...";
      default:
        return "enter your response...";
    }
  };

  const getInputType = (metadataType: string) => {
    switch (metadataType) {
      case "uint256":
        return "number";
      default:
        return "text";
    }
  };

  const validateAddress = (address: string) => {
    if (!address) {
      setError(null);
      return;
    }
    if (!REGEX_ETHEREUM_ADDRESS.test(address)) {
      setError("Invalid address.");
    } else {
      setError(null);
    }
  };

  const validateNumber = (value: string) => {
    if (value === "") {
      setError(null);
      return;
    }
    const num = Number(value);
    if (isNaN(num)) {
      setError("Please enter a valid number.");
    } else if (num < 0) {
      setError("Number must be 0 or positive.");
    } else {
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(index, newValue);

    if (metadataField.metadataType === "uint256") {
      validateNumber(newValue);
    } else if (metadataField.metadataType === "address") {
      validateAddress(newValue);
    }
  };

  useEffect(() => {
    if (metadataField.metadataType === "address" && metadataField.inputValue) {
      validateAddress(metadataField.inputValue);
    } else if (metadataField.metadataType === "uint256" && metadataField.inputValue) {
      validateNumber(metadataField.inputValue);
    }
  }, [metadataField.inputValue, metadataField.metadataType]);

  const getInputClassName = (metadataType: string) => {
    if (metadataType === "uint256") {
      return "text-[16px] w-[216px] rounded-[8px] bg-true-black px-2 py-1 focus:outline-none text-center border border-neutral-10 text-true-white placeholder-neutral-9";
    }

    return "text-[16px] w-full md:w-[502px] border-b border-primary-2 placeholder-neutral-10 bg-transparent focus:outline-none";
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[16px] text-neutral-11">
        {index + 1}) {metadataField.prompt}
      </p>
      <div className="flex flex-col">
        <input
          className={`${getInputClassName(metadataField.metadataType)} ${error ? "border-negative-11" : ""}`}
          placeholder={getPlaceholder(metadataField.metadataType)}
          type={getInputType(metadataField.metadataType)}
          onChange={handleInputChange}
          value={metadataField.inputValue}
        />
        {error && <p className="text-negative-11 text-[14px] mt-2 font-bold">{error}</p>}
      </div>
    </div>
  );
};

export default DialogModalSendProposalMetadataField;
