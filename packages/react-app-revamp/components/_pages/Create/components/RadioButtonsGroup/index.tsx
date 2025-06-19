import { Radio, RadioGroup } from "@headlessui/react";
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

export interface RadioOption {
  label: ReactNode;
  mobileLabel?: string;
  content?: ReactNode;
  value: any;
}

export enum RadioButtonsLabelFontSize {
  SMALL = "text-[16px]",
  MEDIUM = "text-[20px]",
}

interface RadioButtonsGroupProps {
  options: RadioOption[];
  value: any;
  className?: string;
  labelFontSize?: RadioButtonsLabelFontSize;
  onChange?: (value: any) => void;
}

const CreateRadioButtonsGroup = ({
  options,
  value,
  onChange,
  className = "",
  labelFontSize = RadioButtonsLabelFontSize.SMALL,
}: RadioButtonsGroupProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <RadioGroup value={value} onChange={onChange} className={className}>
      <div className="flex flex-col gap-4">
        {options.map((option, index) => (
          <Radio key={index} value={option.value}>
            {({ checked }) => (
              <div className={`flex flex-col gap-4 transition-all duration-200 ${!checked ? "cursor-pointer" : ""}`}>
                <div className="flex gap-4 items-start">
                  <div
                    className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                      checked ? "border-0" : "border border-neutral-9"
                    }`}
                  >
                    {checked && (
                      <>
                        <div className="absolute w-6 h-6 border-2 border-secondary-11 rounded-full"></div>
                        <div className="absolute w-4 h-4 bg-secondary-9 rounded-full"></div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <p
                      className={`normal-case ${labelFontSize} ${
                        checked ? "text-neutral-11 font-bold" : "text-neutral-9 font-normal"
                      }`}
                    >
                      {isMobile && option.mobileLabel ? option.mobileLabel : option.label}
                    </p>
                    {option.content && (
                      <div
                        className={`transition-opacity duration-200 ${
                          checked ? "opacity-100" : "opacity-20 pointer-events-none"
                        }`}
                      >
                        {option.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
};

export default CreateRadioButtonsGroup;
