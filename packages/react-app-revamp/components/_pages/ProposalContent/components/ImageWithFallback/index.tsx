import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface ImageWithFallbackProps {
  mediumSrc: string;
  fullSrc: string;
  alt: string;
  containerWidth: number;
  isExpanded: boolean;
  onImageLoad: (showResizeButton: boolean) => void;
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

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  mediumSrc,
  fullSrc,
  alt,
  containerWidth,
  isExpanded,
  onImageLoad,
}) => {
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
        onImageLoad(significantDifference);
      } else {
        onImageLoad(false);
      }
    }
  }, [mediumImage, fullImage, containerWidth, onImageLoad]);

  const currentImage = isExpanded || !useMediumImage ? fullImage : mediumImage;
  const isLoading = isExpanded || !useMediumImage ? isFullLoading : isMediumLoading;

  return (
    <img
      src={isLoading ? fullSrc : currentImage?.img.src || fullSrc}
      alt={alt}
      className={`rounded-[16px] max-w-full ${isExpanded ? "w-full" : ""}`}
      width={currentImage?.width}
      height={currentImage?.height}
    />
  );
};

export default ImageWithFallback;
