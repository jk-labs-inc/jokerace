/* eslint-disable @next/next/no-img-element */
import Pica from "pica";
import { FC, useEffect, useRef, useState } from "react";

interface MarkdownImageProps {
  src: string;
  maxWidth?: number;
  maxHeight?: number;
}

const MarkdownImage: FC<MarkdownImageProps> = ({ src, maxWidth = 400, maxHeight = 400 }) => {
  const [error, setError] = useState(false);
  const [resizedSrc, setResizedSrc] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!src) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";

    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.error("Image load timed out");
        setError(true);
      }
    }, 10000); // 10 second timeout

    const loadImage = (retryCount = 0) => {
      img.onload = async () => {
        if (!isMounted) return;
        clearTimeout(timeoutId);

        let newWidth = img.width;
        let newHeight = img.height;
        const aspectRatio = img.width / img.height;

        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = newWidth / aspectRatio;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = newHeight * aspectRatio;
        }

        setDimensions({ width: Math.round(newWidth), height: Math.round(newHeight) });

        if (canvasRef.current) {
          const pica = Pica();
          const canvas = canvasRef.current;
          canvas.width = newWidth;
          canvas.height = newHeight;

          try {
            await pica.resize(img, canvas);
            if (isMounted) setResizedSrc(canvas.toDataURL());
          } catch (err) {
            console.error("Image resize failed:", err);
            if (isMounted) setError(true);
          }
        }
      };

      img.onerror = e => {
        if (!isMounted) return;
        if (retryCount < 3) {
          setTimeout(() => loadImage(retryCount + 1), 1000);
        } else {
          clearTimeout(timeoutId);
          setError(true);
        }
      };

      img.src = src;
    };

    loadImage();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [src, maxWidth, maxHeight]);

  if (!src) {
    return <p>No image available</p>;
  }

  if (error) {
    return (
      <img
        src={src}
        style={{ maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }}
        className="rounded-[16px] object-cover"
        alt="Original image"
      />
    );
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {resizedSrc ? <img src={resizedSrc} className="rounded-[16px]" alt="Resized image" /> : <p>Loading...</p>}
    </>
  );
};

export default MarkdownImage;
