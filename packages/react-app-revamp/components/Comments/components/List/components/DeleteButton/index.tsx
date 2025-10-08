import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC, memo } from "react";

interface DeleteButtonProps {
  selectedCount: number;
  onDelete: () => void;
}

const DeleteButton: FC<DeleteButtonProps> = ({ selectedCount, onDelete }) => {
  return (
    <div className="flex sticky bottom-0 left-0 right-0 bg-white shadow-lg">
      <ButtonV3
        size={ButtonSize.EXTRA_LARGE}
        colorClass="bg-gradient-withdraw mx-auto animate-appear"
        onClick={onDelete}
      >
        Delete {selectedCount} {selectedCount === 1 ? "comment" : "comments"}
      </ButtonV3>
    </div>
  );
};

export default memo(DeleteButton);
