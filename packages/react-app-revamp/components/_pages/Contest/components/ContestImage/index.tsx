import { FC } from "react";

interface ContestImageProps {
  imageUrl: string;
}

const ContestImage: FC<ContestImageProps> = ({ imageUrl }) => {
  return (
    <div className="w-full min-h-[296px] bg-true-black rounded-[16px] border-true-black shadow-file-upload p-4">
      <img src={imageUrl} alt="contest" className="w-full max-h-[264px] rounded-2xl object-fill" />
    </div>
  );
};

export default ContestImage;
