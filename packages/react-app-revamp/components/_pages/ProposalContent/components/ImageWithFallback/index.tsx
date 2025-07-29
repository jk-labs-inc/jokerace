import React from "react";

interface ImageWithFallbackProps {
  fullSrc: string;
  alt: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ fullSrc, alt }) => {
  const hasValidSrc = fullSrc && fullSrc.trim() !== "";

  // Don't render anything if no valid source is available
  if (!hasValidSrc) {
    return null;
  }

  return (
    <div className="relative rounded-[16px] w-full h-full">
      <div className="absolute inset-x-0 top-0 h-12 rounded-t-[16px] bg-linear-to-t from-true-black/0 from-0% via-true-black/60 via-30% to-true-black/90 to-100%" />
      <img src={fullSrc} alt={alt} className="rounded-[16px] w-full h-full min-h-52 object-contain" />
    </div>
  );
};

export default ImageWithFallback;
