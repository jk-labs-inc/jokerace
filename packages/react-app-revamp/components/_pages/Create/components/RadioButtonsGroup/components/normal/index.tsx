import { Radio, RadioGroup } from "@headlessui/react";
import { useMediaQuery } from "react-responsive";
import { RadioButtonsGroupProps, RadioButtonsLabelFontSize } from "../../types";

const CreateNormalRadioButtonsGroup = ({
  options,
  value,
  onChange,
  className = "",
  gapClassName = "gap-4",
  labelFontSize = RadioButtonsLabelFontSize.SMALL,
}: RadioButtonsGroupProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <RadioGroup value={value} onChange={onChange} className={className}>
      <div className={`flex flex-col ${gapClassName}`}>
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
                      <div className={`transition-opacity duration-200 ${checked ? "block" : "hidden"}`}>
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

export default CreateNormalRadioButtonsGroup;
