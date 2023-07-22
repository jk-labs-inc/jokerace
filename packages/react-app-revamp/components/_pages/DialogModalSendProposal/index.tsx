import Iframe from "@components/tiptap/Iframe";
import ButtonV3 from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EtheuremAddress from "@components/UI/EtheuremAddress";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { DisableEnter, ShiftEnterCreateExtension } from "@helpers/editor";
import {
  loadSubmissionFromLocalStorage,
  removeSubmissionFromLocalStorage,
  saveSubmissionToLocalStorage,
  SubmissionCache,
} from "@helpers/submissionCaching";
import { useContestStore } from "@hooks/useContest/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import LayoutContestPrompt from "@layouts/LayoutViewContest/Prompt";
import Image from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import moment from "moment";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface DialogModalSendProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalSendProposal: FC<DialogModalSendProposalProps> = ({ isOpen, setIsOpen }) => {
  const { address } = useAccount();
  const { asPath } = useRouter();
  const { sendProposal, isLoading, isSuccess } = useSubmitProposal();
  const { contestPrompt, votesOpen } = useContestStore(state => state);
  const [lastEdited, setLastEdited] = useState<Date>(new Date());
  const formattedDate = lastEdited ? moment(lastEdited).format("MMMM D, h:mm a") : null;
  const contestId = asPath.split("/")[3];
  const savedProposal = loadSubmissionFromLocalStorage("submissions", contestId);
  const [proposal, setProposal] = useState(savedProposal?.content || "");

  const editorProposal = useEditor({
    extensions: [
      StarterKit,
      ShiftEnterCreateExtension,
      DisableEnter,
      Image,
      TiptapExtensionLink,
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "this is my submission and here’s why...",
      }),
      Iframe,
    ],
    content: proposal,
    editorProps: {
      attributes: {
        class: "prose prose-invert pt-6 flex-grow focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setProposal(content);

      const submissionCache: SubmissionCache = {
        contestId,
        content,
        expiresAt: votesOpen,
      };
      saveSubmissionToLocalStorage("submissions", submissionCache);

      setLastEdited(new Date());
    },
  });

  const onSubmitProposal = () => {
    sendProposal(proposal.trim());
  };

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.shiftKey) {
        return;
      }
      if (event.key === "Enter") {
        onSubmitProposal();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onSubmitProposal]);

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      editorProposal?.commands.clearContent();
      removeSubmissionFromLocalStorage("submissions", contestId);
    }
  }, [isSuccess]);

  const tipMessage = () => {
    return (
      <p className="hidden md:flex items-center">
        <span className="font-bold flex items-center gap-1 mr-1">
          shift <NextImage src="/create-flow/shift.png" alt="shift" width={14} height={14} /> + enter{" "}
          <NextImage src="/create-flow/enter.svg" alt="enter" width={14} height={14} />
        </span>
        to make a line break.
      </p>
    );
  };

  return (
    <DialogModalV3 title="submission" isOpen={isOpen} setIsOpen={setIsOpen} className="xl:w-[1110px] 3xl:w-[1300px]">
      <div className="flex flex-col gap-4 md:pl-[50px] lg:pl-[100px] mt-[60px] mb-[60px]">
        <LayoutContestPrompt prompt={contestPrompt} hidePrompt />
        <div className="flex flex-col gap-2">
          <EtheuremAddress ethereumAddress={address ?? ""} shortenOnFallback={true} displayLensProfile={true} />
          <p className="font-bold text-neutral-10">{formattedDate}</p>
        </div>
        <div className="flex flex-col min-h-[12rem] rounded-md ">
          <div className="relative px-1 py-2 border-y-2 border-neutral-10">
            <TipTapEditorControls editor={editorProposal} />
          </div>

          <EditorContent
            editor={editorProposal}
            className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[600px] overflow-y-auto h-auto max-h-[300px] pb-2"
          />
          <p className="text-[16px] text-neutral-11 mt-2">{tipMessage()}</p>
        </div>
        <div className="mt-2">
          <ButtonV3
            color="bg-gradient-create rounded-[40px]"
            size="large"
            onClick={onSubmitProposal}
            disabled={isLoading || !proposal.length}
          >
            submit!
          </ButtonV3>
        </div>
      </div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposal;
