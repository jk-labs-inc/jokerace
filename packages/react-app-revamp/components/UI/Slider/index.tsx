import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FC, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

interface StepSliderProps {
  val?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  step?: number;
  onChange?: (value: any) => void;
}

const StepSlider: FC<StepSliderProps> = ({ val, min = 0, max = 100, defaultValue = 0, step = 25, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!val) return;

    setValue(val);
  }, [val]);

  const handleSliderChange = (value: any) => {
    setValue(value);
    onChange?.(value);
  };

  const trackStyle = {
    backgroundColor: "#BB65FF",
    height: 8,
  };

  const handleStyle = {
    borderColor: "#D9D9D9",
    height: 16,
    width: 16,
    backgroundColor: "#D9D9D9",
    opacity: "1",
  };

  const railStyle = {
    backgroundColor: "#6A6A6A",
    height: 8,
  };

  const dotStyle = {
    borderColor: "#D9D9D9",
    height: 10,
    width: 10,
    backgroundColor: "#D9D9D9",
  };

  return (
    <Slider
      className="w-60"
      min={min}
      // marks={{ 0: "0", 25: "25", 50: "50", 75: "75", 100: "100" }}
      max={max}
      step={1}
      value={value}
      dotStyle={dotStyle}
      trackStyle={trackStyle}
      handleStyle={handleStyle}
      railStyle={railStyle}
      onChange={handleSliderChange}
      handleRender={renderProps => {
        return (
          <div {...renderProps.props} data-tooltip-id="voting-slider">
            <Tooltip
              id="voting-slider"
              style={{
                backgroundColor: "#6A6A6A",
                marginTop: "-5px",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {value}%
            </Tooltip>
          </div>
        );
      }}
    />
  );
};

export default StepSlider;
