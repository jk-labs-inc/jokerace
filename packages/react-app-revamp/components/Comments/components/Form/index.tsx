import { FC } from "react";
import CommentsFormInput from "./components/Input";

interface CommentsFormProps {
  onSend?: (comment: string) => void;
}

const CommentsForm: FC<CommentsFormProps> = ({ onSend }) => {
  return <CommentsFormInput onSend={onSend} />;
};

export default CommentsForm;
