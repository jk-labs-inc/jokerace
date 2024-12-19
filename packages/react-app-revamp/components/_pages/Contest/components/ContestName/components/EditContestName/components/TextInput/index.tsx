import { CONTEST_TITLE_MAX_LENGTH } from "@components/_pages/Create/constants/length";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";

interface EditContestNameTextInputProps {
  value: string;
  handleTextAreaChange?: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleInputChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditContestNameTextInput: FC<EditContestNameTextInputProps> = ({
  value,
  handleTextAreaChange,
  handleInputChange,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={handleTextAreaChange}
        className="text-[24px] md:text-[31px] font-sabo outline-none
        bg-transparent
        text-transparent
        placeholder:text-neutral-10
        [&:not(:placeholder-shown)]:bg-gradient-purple [&:not(:placeholder-shown)]:bg-clip-text
        w-full
        resize-none
        overflow-hidden
        leading-tight"
        placeholder="title of my contest.."
        maxLength={CONTEST_TITLE_MAX_LENGTH}
        rows={2}
      />
    );
  }

  return (
    <input
      autoFocus
      value={value}
      onChange={handleInputChange}
      className="text-[24px] md:text-[31px] font-sabo outline-none
      bg-transparent
      text-transparent
      placeholder:text-neutral-10
      [&:not(:placeholder-shown)]:bg-gradient-purple [&:not(:placeholder-shown)]:bg-clip-text
      w-full
      resize-none
      overflow-hidden
      leading-tight"
      placeholder="title of my contest.."
      maxLength={CONTEST_TITLE_MAX_LENGTH}
    />
  );
};

export default EditContestNameTextInput;
