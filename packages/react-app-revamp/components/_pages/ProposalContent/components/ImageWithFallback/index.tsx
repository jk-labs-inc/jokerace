import NextImage from "next/image";
import { useEffect, useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  containerWidth: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, alt, containerWidth }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [showResizeButton, setShowResizeButton] = useState(false);

  useEffect(() => {
    const mediumImg = new Image();
    mediumImg.src = src;

    const checkSize = () => {
      if (containerWidth > 0) {
        // compare medium image width to container width
        const widthDifference = Math.abs(mediumImg.width - containerWidth);

        // Uue a percentage threshold for comparison
        const threshold = 0.1; // 10% difference
        const significantDifference = widthDifference / containerWidth > threshold;

        setShowResizeButton(significantDifference);
        setImgSrc(mediumImg.complete ? src : fallbackSrc);
      }
    };

    if (mediumImg.complete) {
      checkSize();
    } else {
      mediumImg.onload = checkSize;
      mediumImg.onerror = () => {
        setImgSrc(fallbackSrc);
        setShowResizeButton(false);
      };
    }
  }, [src, fallbackSrc, containerWidth]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    setImgSrc(isExpanded ? src : fallbackSrc);
  };

  return (
    <div className="relative inline-block">
      <img src={imgSrc} alt={alt} className="rounded-[16px] max-w-full" />
      {showResizeButton && (
        <div className="absolute top-0 right-0 p-1">
          <button
            onClick={toggleExpand}
            className="bg-primary-2 opacity-75 p-2 rounded-full hover:opacity-100 transition-opacity z-10"
          >
            {isExpanded ? (
              <NextImage src="/contest/minimize.svg" width={14} height={14} alt="minimize" />
            ) : (
              <NextImage src="/contest/maximize.svg" width={14} height={14} alt="maximize" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
