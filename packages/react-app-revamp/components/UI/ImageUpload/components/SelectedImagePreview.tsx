import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { FC } from "react";

interface SelectedImagePreviewProps {
  imageUrl: string;
  onRemove: (e: React.MouseEvent) => void;
}

const SelectedImagePreview: FC<SelectedImagePreviewProps> = ({ imageUrl, onRemove }) => (
  <div
    className="relative flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[376px] md:h-36 justify-center items-center border border-transparent hover:border-positive-11 gap-2 py-2 px-10 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out"
    style={{
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <button
      onClick={onRemove}
      className="absolute top-2 right-2 bg-true-black rounded-full p-1 shadow-md hover:bg-neutral-3 transition-colors duration-200"
    >
      <XMarkIcon className="w-6 h-6 text-neutral-11" />
    </button>
  </div>
);

export default SelectedImagePreview;
