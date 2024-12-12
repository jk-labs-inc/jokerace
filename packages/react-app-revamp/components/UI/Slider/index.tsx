import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Tooltip } from "react-tooltip";

interface StepSliderProps {
  val: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  step?: number;
  onChange?: (value: any) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const StepSlider: FC<StepSliderProps> = ({
  val,
  min = 0,
  max = 100,
  defaultValue = 0,
  step = 1,
  onChange,
  onKeyDown,
}) => {
  const [value, setValue] = useState(defaultValue);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setValue(val);
  }, [val]);

  const handleSliderChange = (value: any) => {
    setValue(value);
    onChange?.(value);
  };

  const styles = {
    track: {
      backgroundColor: "#BB65FF",
      height: 8,
    },
    handle: {
      borderColor: "#D9D9D9",
      height: isMobile ? 32 : 16,
      width: isMobile ? 32 : 16,
      backgroundColor: "#D9D9D9",
      opacity: 1,
      cursor: "pointer",
      marginTop: isMobile ? -12 : -4,
    },
    rail: {
      backgroundColor: "#6A6A6A",
      height: 8,
    },
    dot: {
      borderColor: "#D9D9D9",
      height: 10,
      width: 10,
      backgroundColor: "#D9D9D9",
    },
  };

  return (
    <div onKeyDown={onKeyDown} tabIndex={0}>
      <Slider
        className="w-60"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleSliderChange}
        allowCross={false}
        pushable={true}
        styles={styles}
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
    </div>
  );
};

export default StepSlider;
