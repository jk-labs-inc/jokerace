/* eslint-disable @next/next/no-img-element */
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
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
            className="bg-true-black bg-opacity-50 text-neutral-11 p-1 rounded-full hover:bg-opacity-75 transition-all z-10"
          >
            {isExpanded ? (
              <ArrowsPointingInIcon className="w-6 h-6 text-neutral-11" />
            ) : (
              <ArrowsPointingOutIcon className="w-6 h-6 text-neutral-11" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
