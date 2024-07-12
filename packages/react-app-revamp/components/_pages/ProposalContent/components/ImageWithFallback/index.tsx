/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useEffect, useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, alt }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasMediumVersion, setHasMediumVersion] = useState(false);

  useEffect(() => {
    const mediumImg = new Image();
    mediumImg.src = src;
    mediumImg.onload = () => {
      setImgSrc(src);
      setHasMediumVersion(true);
    };
    mediumImg.onerror = () => {
      setImgSrc(fallbackSrc);
      setHasMediumVersion(false);
    };
  }, [src, fallbackSrc]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    setImgSrc(isExpanded ? src : fallbackSrc);
  };

  return (
    <div className="relative inline-block">
      <img src={imgSrc} alt={alt} className="rounded-[16px]" />
      {hasMediumVersion && (
        <div className="absolute top-0 right-0 p-1">
          <button
            onClick={toggleExpand}
            className="bg-true-black opacity-75 p-2 rounded-full hover:opacity-100 transition-opacity z-10"
          >
            {isExpanded ? (
              <NextImage src="/contest/minimize.svg" width={18} height={18} alt="minimize" />
            ) : (
              <NextImage src="/contest/maximize.svg" width={18} height={18} alt="maximize" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
