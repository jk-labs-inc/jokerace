import { TrashIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface SubmissionDeleteButtonProps {
  onClick?: () => void;
}

const SubmissionDeleteButton: FC<SubmissionDeleteButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <TrashIcon className="h-4 w-4 md:h-6 md:w-6 text-negative-11 bg-true-black hover:text-negative-10 transition-colors duration-300 ease-in-out" />
    </button>
  );
};

export default SubmissionDeleteButton;
