import { FC } from "react";

interface ContestImageProps {
  imageUrl: string;
}

const ContestImage: FC<ContestImageProps> = ({ imageUrl }) => {
  return (
    <div className="w-full md:min-w-[760px] min-h-[294px] rounded-2xl shadow-file-upload relative overflow-hidden">
      {/* background blurred layer */}
      <div
        className="absolute inset-[-20px] bg-cover bg-center opacity-80 blur-[30px]"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />

      {/* centered main image container using absolute positioning */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={imageUrl} alt="contest" className="max-w-[760px] max-h-[294px] w-auto h-auto object-contain" />
      </div>
    </div>
  );
};

export default ContestImage;
