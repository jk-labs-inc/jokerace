import { ReactNode } from "react";

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

export interface RadioButtonsGroupProps {
  options: RadioOption[];
  value: any;
  className?: string;
  gapClassName?: string;
  labelFontSize?: RadioButtonsLabelFontSize;
  onChange?: (value: any) => void;
}

export enum RadioButtonsGroupType {
  NORMAL = "normal",
  FADED = "faded",
}
