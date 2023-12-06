import { FC } from "react";
import CommentsFormInput from "./components/Input";

interface CommentsFormProps {
  contestChainId: number;
  isAdding: boolean;
  isAddingSuccess: boolean;
  onSend?: (comment: string) => void;
}

const CommentsForm: FC<CommentsFormProps> = ({ onSend, contestChainId, isAddingSuccess, isAdding }) => {
  return (
    <CommentsFormInput
      onSend={onSend}
      contestChainId={contestChainId}
      isAdding={isAdding}
      isAddingSuccess={isAddingSuccess}
    />
  );
};

export default CommentsForm;
