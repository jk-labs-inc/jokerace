import EthereumAddress from "@components/UI/EtheuremAddress";
import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";

interface CommentsFormInputProps {
  onSend?: (comment: string) => void;
}

const CommentsFormInput: React.FC<CommentsFormInputProps> = ({ onSend = () => {} }) => {
  const { address } = useAccount();
  const [comment, setComment] = useState("");
  const textInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textInputRef.current && !comment) {
      textInputRef.current.textContent = "";
    }
  }, [comment]);

  const handleInputChange = (event: React.FormEvent<HTMLDivElement>) => {
    setComment(event.currentTarget.textContent || "");
  };

  const handleSend = () => {
    if (comment.trim()) {
      onSend(comment.trim());
      setComment("");
    }
  };

  return (
    <div className="relative flex  items-center bg-gray-800 rounded-lg">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <EthereumAddress avatarVersion ethereumAddress={address ?? ""} shortenOnFallback />
      </div>

      <div
        className={`text-[16px] pl-14 pr-12 flex-grow bg-neutral-9 rounded-[40px] p-2 text-true-black resize-none overflow-hidden focus:outline-none ${
          !comment && "placeholder-gray-400"
        }`}
        contentEditable
        role="textbox"
        aria-multiline="true"
        ref={textInputRef}
        onInput={handleInputChange}
        onBlur={() => !comment && setComment("")}
        onFocus={() => !comment && setComment("")}
        suppressContentEditableWarning={true}
      >
        {!comment && "add a comment..."}
      </div>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 rounded-lg text-white focus:outline-none focus:border-none"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default CommentsFormInput;
