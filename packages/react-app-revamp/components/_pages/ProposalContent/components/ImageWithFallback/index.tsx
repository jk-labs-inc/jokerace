import { useQuery } from "@tanstack/react-query";
import React from "react";

interface ImageWithFallbackProps {
  mediumSrc: string;
  fullSrc: string;
  alt: string;
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

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ mediumSrc, fullSrc, alt }) => {
  const { data: mediumImage, isLoading: isMediumLoading } = useQuery({
    queryKey: ["image", mediumSrc, "medium"],
    queryFn: () => preloadImage(mediumSrc),
    staleTime: Infinity,
  });

  const currentImage = mediumImage || { img: { src: fullSrc } };
  const isLoading = isMediumLoading;

  return (
    <div className="relative rounded-[16px] w-full h-full">
      <div className="absolute inset-x-0 top-0 h-12 rounded-t-[16px] bg-gradient-to-t from-true-black/0 from-0% via-true-black/60 via-30% to-true-black/90 to-100%" />
      <img
        src={isLoading ? fullSrc : currentImage.img.src}
        alt={alt}
        className="rounded-[16px] w-full h-full min-h-52 object-contain"
      />
    </div>
  );
};

export default ImageWithFallback;
