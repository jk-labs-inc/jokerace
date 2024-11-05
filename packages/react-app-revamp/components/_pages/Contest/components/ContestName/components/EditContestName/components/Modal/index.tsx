import { CONTEST_TITLE_MAX_LENGTH } from "@components/_pages/Create/constants/length";
import DialogModalV4 from "@components/UI/DialogModalV4";
import { FC, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface EditContestNameModalProps {
  contestName: string;
  isOpen: boolean;
  setIsCloseModal: (isOpen: boolean) => void;
  handleEditContestName?: (value: string) => void;
}

const EditContestNameModal: FC<EditContestNameModalProps> = ({
  contestName,
  isOpen,
  setIsCloseModal,
  handleEditContestName,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [inputValue, setInputValue] = useState(contestName);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setInputValue(contestName);
  }, [contestName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setError("title cannot be empty");
    } else if (value.length >= CONTEST_TITLE_MAX_LENGTH) {
      setError(`title must not exceed ${CONTEST_TITLE_MAX_LENGTH} characters`);
    } else {
      setError("");
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setError("title cannot be empty");
    } else if (value.length >= CONTEST_TITLE_MAX_LENGTH) {
      setError(`title must not exceed ${CONTEST_TITLE_MAX_LENGTH} characters`);
    } else {
      setError("");
    }
  };

  const handleEditContestNameClick = (value: string) => {
    if (!value.trim() || value.length >= CONTEST_TITLE_MAX_LENGTH) {
      return;
    }

    handleEditContestName?.(value);
    setIsCloseModal(false);
  };

  return (
    <DialogModalV4 isOpen={isOpen} onClose={setIsCloseModal}>
      <div className="flex flex-col gap-14 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">edit title</p>
          <img
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsCloseModal(false)}
          />
        </div>
        <div className="bg-true-black w-full md:w-[700px] rounded-[16px] border-true-black md:shadow-file-upload md:p-4">
          <div className="bg-secondary-1 w-full rounded-[16px] outline-none p-4">
            {isMobile ? (
              <textarea
                autoFocus
                value={inputValue}
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
            ) : (
              <input
                autoFocus
                value={inputValue}
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
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {error && <p className="text-[16px] text-negative-11 font-bold">{error}</p>}
          <button
            className="bg-gradient-purple self-center md:self-start rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
            onClick={() => handleEditContestNameClick(inputValue)}
          >
            save title
          </button>
        </div>
      </div>
    </DialogModalV4>
  );
};

export default EditContestNameModal;
