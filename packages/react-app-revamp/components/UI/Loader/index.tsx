"use client";

import { motion } from "motion/react";

interface LoaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const Loader = (props: LoaderProps) => {
  const { children, className } = props;
  return (
    <div className={`flex flex-col gap-8 items-center justify-center mt-40 ${className}`}>
      <motion.img
        src="/landing/bubbles-money.svg"
        alt="bubbles-money"
        height={160}
        width={160}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      />
      <p className="font-sabo-filled text-neutral-14 text-[16px]">{children ?? "Loading, one moment please"}</p>
    </div>
  );
};

export default Loader;
