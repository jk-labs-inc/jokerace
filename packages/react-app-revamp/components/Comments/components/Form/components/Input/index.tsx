/* eslint-disable react-hooks/exhaustive-deps */
import EthereumAddress from "@components/UI/EtheuremAddress";
import { DisableEnter, ShiftEnterCreateExtension } from "@helpers/editor";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { switchNetwork } from "@wagmi/core";
import { useEffect, useRef, useState } from "react";
import { useMedia } from "react-use";
import { useAccount, useNetwork } from "wagmi";
import CommentFormInputSubmitButton from "./components/SubmitButton";

interface CommentsFormInputProps {
  contestChainId: number;
  isAdding: boolean;
  isAddingSuccess: boolean;
  onSend?: (comment: string) => void;
}

const CommentsFormInput: React.FC<CommentsFormInputProps> = ({ onSend, contestChainId, isAddingSuccess, isAdding }) => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const isUserOnCorrectNetwork = chain?.id === contestChainId;
  const [commentContent, setCommentContent] = useState("");
  const placeholderText = "add a comment...";
  const [allowSend, setAllowSend] = useState(false);
  const isMobile = useMedia("(max-width: 768px)");
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const commentEditor = useEditor({
    extensions: [
      StarterKit,
      ShiftEnterCreateExtension,
      DisableEnter,
      TiptapExtensionLink,
      Placeholder.configure({
        emptyEditorClass: "is-editor-comment-empty",
        placeholder: placeholderText,
      }),
    ],
    content: commentContent,
    editorProps: {
      attributes: {
        class: "prose prose-invert flex-grow focus:outline-none text-true-white",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();

      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }

      if (editor.getText().length > 0) {
        setAllowSend(true);
      } else {
        setAllowSend(false);
      }

      setCommentContent(content);
    },
  });

  useEffect(() => {
    if (!isAddingSuccess) return;

    resetStates();
  }, [isAddingSuccess]);

  const resetStates = () => {
    setCommentContent("");
    setAllowSend(false);
    commentEditor?.commands.clearContent();
  };

  const onSendCommentHandler = () => {
    if (!allowSend || isAdding) return;

    onSend?.(commentContent);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isMobile) {
      onSendCommentHandler();
    }
  };

  const onSwitchNetwork = async () => {
    await switchNetwork({ chainId: contestChainId });
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${
        containerHeight > 48 ? "items-end" : "items-center"
      } p-2 gap-3 w-full md:w-[660px] rounded-[10px] bg-primary-2`}
    >
      <div>
        <EthereumAddress avatarVersion ethereumAddress={address ?? ""} shortenOnFallback />
      </div>
      <EditorContent
        editor={commentEditor}
        className="bg-transparent outline-none w-full md:w-[660px] overflow-y-auto max-h-[300px] "
        onKeyDown={handleKeyDown}
      />
      <CommentFormInputSubmitButton
        allowSend={allowSend}
        isAdding={isAdding}
        isMobile={isMobile}
        isConnected={isConnected}
        isUserOnCorrectNetwork={isUserOnCorrectNetwork}
        onSend={onSendCommentHandler}
        onConnect={openConnectModal}
        onSwitchNetwork={onSwitchNetwork}
      />
    </div>
  );
};

export default CommentsFormInput;
