import React, { useState, useEffect } from "react";

interface ChangingProgressProviderProps {
  values: number[];
  interval?: number;
  children: (value: number) => React.ReactNode;
}

const ChangingProgressProvider: React.FC<ChangingProgressProviderProps> = ({ values, interval = 1000, children }) => {
  const [valuesIndex, setValuesIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValuesIndex(prevValuesIndex => (prevValuesIndex + 1) % values.length);
    }, interval);

    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(timer);
    };
  }, [values, interval]);

  return <>{children(values[valuesIndex])}</>;
};

export default ChangingProgressProvider;
