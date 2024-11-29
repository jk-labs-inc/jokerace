import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";

interface CreateFlowPromptPreviewToggleProps {
  onClick?: () => void;
}

const CreateFlowPromptPreviewToggle: FC<CreateFlowPromptPreviewToggleProps> = ({ onClick }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const buttonText = isPreviewOpen ? "close preview" : "show preview";

  const handleClick = () => {
    setIsPreviewOpen(!isPreviewOpen);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className="flex justify-between items-center w-40 px-4 py-1 bg-true-black rounded-2xl shadow-prompt-preview text-neutral-14 hover:bg-neutral-14 hover:text-true-black transition-colors duration-300 ease-in-out"
    >
      {isPreviewOpen ? <EyeSlashIcon className="w-6 h-6 " /> : <EyeIcon className="w-6 h-6 " />}
      <p className="text-[16px] font-bold">{buttonText}</p>
    </button>
  );
};

export default CreateFlowPromptPreviewToggle;
