import { CONTEST_TITLE_MAX_LENGTH, CONTEST_TITLE_MIN_LENGTH } from "@components/_pages/Create/constants/length";
import DialogModalV4 from "@components/UI/DialogModalV4";
import { FC, useEffect, useRef, useState } from "react";

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
  const [inputValue, setInputValue] = useState(contestName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setInputValue(contestName);
  }, [contestName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleEditContestNameClick = (value: string) => {
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
        <div className="bg-true-black w-full md:w-[600px] h-28 rounded-[16px] border-true-black md:shadow-file-upload md:p-4">
          <div className="bg-secondary-1 w-full h-28 md:h-20 rounded-[16px] outline-none p-4">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="text-[24px] md:text-[31px] font-sabo outline-none
              bg-transparent
             text-transparent
              placeholder:text-neutral-10
              [&:not(:placeholder-shown)]:bg-gradient-purple [&:not(:placeholder-shown)]:bg-clip-text"
              placeholder="title of my contest.."
              minLength={CONTEST_TITLE_MIN_LENGTH}
              maxLength={CONTEST_TITLE_MAX_LENGTH}
            />
          </div>
        </div>
        <button
          className="bg-gradient-purple self-center md:self-start rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
          onClick={() => handleEditContestNameClick(inputValue)}
        >
          save title
        </button>
      </div>
    </DialogModalV4>
  );
};

export default EditContestNameModal;
