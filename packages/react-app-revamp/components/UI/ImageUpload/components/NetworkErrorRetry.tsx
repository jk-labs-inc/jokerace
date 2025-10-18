import CreateRadioButtonsGroup from "@components/_pages/Create/components/RadioButtonsGroup";
import {
  RadioButtonsGroupType,
  RadioButtonsLabelFontSize,
  RadioOption,
} from "@components/_pages/Create/components/RadioButtonsGroup/types";
import React, { FC } from "react";

interface NetworkErrorRetryProps {
  inputMethod: "upload" | "url";
  onInputMethodChange: (method: "upload" | "url") => void;
  uploadAreaComponent: React.ReactNode;
  urlInputComponent: React.ReactNode;
}

const NetworkErrorRetry: FC<NetworkErrorRetryProps> = ({
  inputMethod,
  onInputMethodChange,
  uploadAreaComponent,
  urlInputComponent,
}) => {
  const networkErrorRadioOptions: RadioOption[] = [
    {
      label: "try to upload again",
      value: "upload",
      content: uploadAreaComponent,
    },
    {
      label: "insert image URL",
      value: "url",
      content: urlInputComponent,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CreateRadioButtonsGroup
        type={RadioButtonsGroupType.NORMAL}
        options={networkErrorRadioOptions}
        value={inputMethod}
        onChange={onInputMethodChange}
        className="mt-2"
        labelFontSize={RadioButtonsLabelFontSize.SMALL}
      />
    </div>
  );
};

export default NetworkErrorRetry;
