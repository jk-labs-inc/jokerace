import CreateNormalRadioButtonsGroup from "./components/normal";
import CreateFadedRadioButtonsGroup from "./components/faded";
import { RadioButtonsGroupType, RadioButtonsLabelFontSize, RadioOption } from "./types";

interface CreateRadioButtonsGroupProps {
  type: RadioButtonsGroupType;
  options: RadioOption[];
  value: any;
  className?: string;
  gapClassName?: string;
  labelFontSize?: RadioButtonsLabelFontSize;
  onChange?: (value: any) => void;
}

const CreateRadioButtonsGroup = ({
  type,
  options,
  value,
  className,
  gapClassName,
  labelFontSize,
  onChange,
}: CreateRadioButtonsGroupProps) => {
  const Component =
    type === RadioButtonsGroupType.NORMAL ? CreateNormalRadioButtonsGroup : CreateFadedRadioButtonsGroup;

  return (
    <Component
      options={options}
      value={value}
      className={className}
      gapClassName={gapClassName}
      labelFontSize={labelFontSize}
      onChange={onChange}
    />
  );
};

export default CreateRadioButtonsGroup;
