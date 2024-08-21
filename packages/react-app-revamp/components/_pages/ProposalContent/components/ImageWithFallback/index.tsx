import NextImage from "next/image";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface ImageWithFallbackProps {
  mediumSrc: string;
  fullSrc: string;
  alt: string;
  containerWidth: number;
}

interface ImageData {
  img: HTMLImageElement;
  width: number;
  height: number;
}

const preloadImage = async (src: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve({ img, width: img.width, height: img.height });
    img.onerror = reject;
  });
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ mediumSrc, fullSrc, alt, containerWidth }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResizeButton, setShowResizeButton] = useState(false);
  const [useMediumImage, setUseMediumImage] = useState(true);

  const { data: mediumImage, isLoading: isMediumLoading } = useQuery({
    queryKey: ["image", mediumSrc, "medium"],
    queryFn: () => preloadImage(mediumSrc),
    staleTime: Infinity,
  });

  const { data: fullImage, isLoading: isFullLoading } = useQuery({
    queryKey: ["image", fullSrc, "full"],
    queryFn: () => preloadImage(fullSrc),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (mediumImage && fullImage) {
      const isMediumLarger = mediumImage.width > fullImage.width || mediumImage.height > fullImage.height;
      setUseMediumImage(!isMediumLarger);

      if (!isMediumLarger && containerWidth > 0) {
        const widthDifference = Math.abs(mediumImage.width - containerWidth);
        const threshold = 0.1; // 10% difference
        const significantDifference = widthDifference / containerWidth > threshold;
        setShowResizeButton(significantDifference);
      } else {
        setShowResizeButton(false);
      }
    }
  }, [mediumImage, fullImage, containerWidth]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const currentImage = isExpanded || !useMediumImage ? fullImage : mediumImage;
  const isLoading = isExpanded || !useMediumImage ? isFullLoading : isMediumLoading;

  return (
    <div className="relative inline-block">
      <img
        src={isLoading ? fullSrc : currentImage?.img.src || fullSrc}
        alt={alt}
        className={`rounded-[16px] max-w-full ${isExpanded ? "w-full" : ""}`}
        width={currentImage?.width}
        height={currentImage?.height}
      />
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
