import { FC } from "react";

interface ScrollShadowProps {
  showTopShadow: boolean;
  showBottomShadow: boolean;
}

const ScrollShadow: FC<ScrollShadowProps> = ({ showTopShadow, showBottomShadow }) => {
  return (
    <>
      {/* Top scroll shadow */}
      <div
        className={`absolute top-0 left-8 right-4 h-6 bg-gradient-to-b from-neutral-17 to-transparent pointer-events-none z-10 transition-opacity ease-in-out duration-200 ${
          showTopShadow ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Bottom scroll shadow */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-neutral-17 to-transparent pointer-events-none z-10 transition-opacity ease-in-out duration-200 rounded-b-4xl ${
          showBottomShadow ? "opacity-90" : "opacity-0"
        }`}
      />
    </>
  );
};

export default ScrollShadow;
