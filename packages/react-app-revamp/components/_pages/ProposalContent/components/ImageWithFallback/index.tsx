import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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
    <img src={isLoading ? fullSrc : currentImage.img.src} alt={alt} className="rounded-[16px] max-w-full w-full" />
  );
};

export default ImageWithFallback;
