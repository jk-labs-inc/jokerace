import { FC, useState, useEffect } from "react";

interface ProgressiveImgProps {
  src: string;
  alt: string;
}

const ProgressiveImg: FC<ProgressiveImgProps> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto max-h-[400px] object-contain object-left rounded-lg my-4`}
      style={{
        filter: isLoaded ? "blur(0px)" : "blur(10px)",
        transition: isLoaded ? "filter 0.5s linear" : "none",
      }}
      loading="lazy"
    />
  );
};

export default ProgressiveImg;
