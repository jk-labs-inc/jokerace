import { FC } from "react";
import { parsePrompt } from "../Prompt/utils";

interface ContestImageProps {
  imageUrl: string;
}

const ContestImage: FC<ContestImageProps> = ({ imageUrl }) => {
  return (
    <div className="gradient-border p-4">
      <img src={imageUrl} alt="contest" className="w-full h-auto max-h-[300px] radial-mask" />
    </div>
  );
};

export default ContestImage;
