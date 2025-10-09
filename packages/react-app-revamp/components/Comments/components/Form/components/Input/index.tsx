/* eslint-disable react-hooks/exhaustive-deps */
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { config } from "@config/wagmi";
import { DisableEnter, ShiftEnterCreateExtension } from "@helpers/editor";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { switchChain } from "@wagmi/core";
import { FC, useEffect, useRef, useState } from "react";
import { useMedia } from "react-use";
import { useAccount } from "wagmi";
import CommentFormInputSubmitButton from "./components/SubmitButton";

interface CommentsFormInputProps {
  contestChainId: number;
  isAdding: boolean;
  isAddingSuccess: boolean;
  onSend?: (comment: string) => void;
}

interface CommentEditorConfigArgs {
  content: string;
  placeholderText: string;
  onUpdate: any;
  isMobile: boolean;
}

const commentEditorConfig = ({ content, placeholderText, onUpdate, isMobile }: CommentEditorConfigArgs) => {
  let extensions = [
    StarterKit,
    Placeholder.configure({
      emptyEditorClass: "is-editor-create-flow-empty",
      placeholder: placeholderText,
    }),
  ];

  if (!isMobile) {
    extensions = [...extensions, ShiftEnterCreateExtension, DisableEnter];
  }

  return {
    extensions: extensions,
    content: content,
    editorProps: {
      attributes: {
        class: "prose prose-invert grow focus:outline-none",
      },
    },
    onUpdate: onUpdate,
  };
};

const CommentsFormInput: FC<CommentsFormInputProps> = ({ onSend, contestChainId, isAddingSuccess, isAdding }) => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected, chainId } = useAccount();
  const [commentContent, setCommentContent] = useState("");
  const [allowSend, setAllowSend] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMedia("(max-width: 768px)");
  const placeholderText = "add a comment...";
  const isUserOnCorrectNetwork = chainId === contestChainId;

  const commentEditor = useEditor(
    commentEditorConfig({
      content: commentContent,
      placeholderText: placeholderText,
      onUpdate: ({ editor }: { editor: Editor }) => {
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
      isMobile: isMobile,
    }),
  );

  useEffect(() => {
    if (!isAddingSuccess) return;

    setCommentContent("");
    setAllowSend(false);
    commentEditor?.commands.clearContent();
  }, [isAddingSuccess]);

  const handleSendComment = async () => {
    if (!allowSend || isAdding) return;

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!isUserOnCorrectNetwork) {
      await switchChain(config, { chainId: contestChainId });
      return;
    }

    onSend?.(commentContent);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    const allowEnter = !event.shiftKey && !isMobile;
    if (event.key === "Enter" && allowEnter) {
      handleSendComment();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${
        containerHeight > 48 ? "items-end" : "items-center"
      } p-2 gap-3 w-full md:w-[544px] rounded-[10px] bg-secondary-1 border border-neutral-17`}
    >
      <div>
        <UserProfileDisplay avatarVersion ethereumAddress={address ?? ""} shortenOnFallback size="compact" />
      </div>
      <EditorContent
        editor={commentEditor}
        className="bg-transparent outline-none w-full overflow-y-auto max-h-[300px]"
        onKeyDown={handleKeyDown}
      />
      <CommentFormInputSubmitButton
        allowSend={allowSend}
        isAdding={isAdding}
        isMobile={isMobile}
        isConnected={isConnected}
        onSend={handleSendComment}
        onConnect={openConnectModal}
      />
    </div>
  );
};

export default CommentsFormInput;
