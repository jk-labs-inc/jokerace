import { RadioGroup } from "@headlessui/react";

export const FormRadioGroup = (props: any) => {
  return (
    <RadioGroup className={`text-sm space-y-1 ${props?.disabled ? "cursor-not-allowed opacity-50" : ""}`} {...props} />
  );
};

export default FormRadioGroup;
