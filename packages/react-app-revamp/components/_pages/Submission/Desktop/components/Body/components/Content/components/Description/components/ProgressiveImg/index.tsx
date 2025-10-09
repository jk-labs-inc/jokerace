import { FC, useState, useEffect } from "react";
import ImageModal from "../ImageModal";

interface ProgressiveImgProps {
  src: string;
  alt: string;
}

const ProgressiveImg: FC<ProgressiveImgProps> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [src]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.blur();
    setIsModalOpen(true);
  };

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto max-h-[320px] object-contain object-left rounded-lg my-4 cursor-zoom-in hover:opacity-90 transition-opacity`}
        style={{
          filter: isLoaded ? "blur(0px)" : "blur(10px)",
          transition: isLoaded ? "filter 0.5s linear" : "none",
        }}
        loading="lazy"
        onClick={handleImageClick}
        onKeyDown={handleImageKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Click to view full size: ${alt}`}
      />

      <ImageModal src={src} alt={alt} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ProgressiveImg;
