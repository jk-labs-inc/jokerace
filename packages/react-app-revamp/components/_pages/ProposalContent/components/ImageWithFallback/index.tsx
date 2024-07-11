/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
    img.onerror = () => setImgSrc(fallbackSrc);
  }, [src, fallbackSrc]);

  return <img src={imgSrc} alt={alt} className="rounded-[16px]" />;
};

export default ImageWithFallback;
