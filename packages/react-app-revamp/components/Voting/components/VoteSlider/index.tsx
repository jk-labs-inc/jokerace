import StepSlider from "@components/UI/Slider";
import { FC } from "react";

interface VoteSliderProps {
  value: number;
  onChange: (value: any) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const VoteSlider: FC<VoteSliderProps> = ({ value, onChange, onKeyDown }) => {
  return <StepSlider val={value} onChange={onChange} onKeyDown={onKeyDown} />;
};

export default VoteSlider;
