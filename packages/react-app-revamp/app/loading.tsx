"use client";
import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <LoadingBar color="#BB65FF" progress={progress} />;
}
