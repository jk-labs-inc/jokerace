import { getContestImageUrl } from "@layouts/LayoutViewContest/helpers/getContestImageUrl";
import { motion } from "motion/react";
import { FC, ReactNode, useState, useEffect } from "react";

interface ContestCardContainerProps {
  prompt: string | null;
  children?: ReactNode;
}

const ContestCardContainer: FC<ContestCardContainerProps> = ({ prompt, children }) => {
  const contestImageUrl = getContestImageUrl(prompt);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // TODO: i'm just experimenting with this, i'm using this on submission page where i blur the image until it's loaded. i might not use it here but just wanna check how it feels
  useEffect(() => {
    if (!contestImageUrl) return;

    setIsImageLoaded(false);
    const img = new Image();
    img.src = contestImageUrl;
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, [contestImageUrl]);

  return (
    <motion.div
      className="w-full md:w-80 h-64 rounded-lg border border-primary-2 overflow-hidden relative hover:border-primary-3 transition-all duration-300"
      initial="idle"
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: contestImageUrl
            ? `url(${contestImageUrl})`
            : "linear-gradient(155deg, #381D4C -2.14%, #000 33.85%)",
          willChange: "transform",
          ...(contestImageUrl && {
            filter: isImageLoaded ? "blur(0px)" : "blur(10px)",
            transition: isImageLoaded ? "filter 0.5s linear" : "none",
          }),
        }}
        variants={{
          idle: { scale: 1 },
          hover: { scale: 1.1 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      {contestImageUrl && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26, 26, 26, 0.60) 0%, rgba(26, 26, 26, 0.70) 39.64%, rgba(26, 26, 26, 0.80) 69.09%, rgba(26, 26, 26, 0.80) 100%)",
          }}
        />
      )}
      <div className="relative h-full px-4 pb-2 flex flex-col justify-end">{children}</div>
    </motion.div>
  );
};

export default ContestCardContainer;
