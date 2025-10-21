import CreateTextInput from "@components/_pages/Create/components/TextInput";
import React, { FC } from "react";

interface UrlInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  validationError?: string;
}

const UrlInputField: FC<UrlInputFieldProps> = ({ value, onChange, validationError }) => (
  <div className="flex flex-col gap-2 w-full md:w-[376px]">
    <CreateTextInput value={value} onChange={onChange} placeholder="https://i.imgur.com/example.jpg" />
    {validationError && <p className="text-negative-11 text-[16px] font-bold">{validationError}</p>}
  </div>
);

export default UrlInputField;
