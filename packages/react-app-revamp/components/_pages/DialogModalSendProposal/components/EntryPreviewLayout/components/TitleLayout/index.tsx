import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface DialogModalSendProposalEntryPreviewTitleLayoutProps {
  onChange?: (value: string) => void;
}

const MAX_TITLE_LENGTH = 32;

const DialogModalSendProposalEntryPreviewTitleLayout: FC<DialogModalSendProposalEntryPreviewTitleLayoutProps> = ({
  onChange,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [inputValue, setInputValue] = useState("");
  const [isExceeded, setIsExceeded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsExceeded(value.length >= MAX_TITLE_LENGTH);
    onChange?.(value.slice(0, MAX_TITLE_LENGTH));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] font-bold text-neutral-11">title</p>
      <div className={`bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"} `}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="text-[16px] bg-secondary-1 outline-none rounded-[16px] placeholder-neutral-10 w-full h-12 indent-4 focus:outline-none"
          placeholder="this is my entry..."
          maxLength={MAX_TITLE_LENGTH}
        />
      </div>
      {isExceeded && <p className="text-negative-11 text-[12px] font-bold">maximum character limit reached!</p>}
    </div>
  );
};

export default DialogModalSendProposalEntryPreviewTitleLayout;
