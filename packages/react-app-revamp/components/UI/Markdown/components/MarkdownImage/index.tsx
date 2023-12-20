/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";

interface MarkdownImageProps {
  imageSize: "compact" | "full";
  src: string;
}

const MarkdownImage: FC<MarkdownImageProps> = ({ src, imageSize }) => {
  const [error, setError] = useState(false);
  const size = imageSize === "compact" ? "w-24 md:w-44 md:h-40" : "w-[350px]";

  if (!src) {
    return <p>No image available</p>;
  }

  if (error) {
    return (
      <p>
        <a href={src} target="_blank" rel="noopener noreferrer">
          {src}
        </a>
      </p>
    );
  }

  return <img src={src} className={`${size}`} alt="image" onError={() => setError(true)} />;
};

export default MarkdownImage;
