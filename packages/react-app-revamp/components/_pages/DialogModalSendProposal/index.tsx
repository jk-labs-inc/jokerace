/* eslint-disable react-hooks/exhaustive-deps */
import Iframe from "@components/tiptap/Iframe";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { goToProposalPage } from "@helpers/routing";
import {
  loadSubmissionFromLocalStorage,
  saveSubmissionToLocalStorage,
  SubmissionCache,
} from "@helpers/submissionCaching";
import { useContestStore } from "@hooks/useContest/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { useUploadImageStore } from "@hooks/useUploadImage";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { useEditorStore } from "@hooks/useEditor/store";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { switchNetwork } from "@wagmi/core";
import moment from "moment";
import router, { useRouter } from "next/router";
import { FC, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useMediaQuery } from "react-responsive";

interface DialogModalSendProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalSendProposal: FC<DialogModalSendProposalProps> = ({ isOpen, setIsOpen }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const { chainName, address: contestId } = extractPathSegments(asPath);
  const { sendProposal, isLoading } = useSubmitProposal();
  const { contestPrompt, votesOpen } = useContestStore(state => state);
  const { setRevertTextOption } = useEditorStore(state => state);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const savedProposal = loadSubmissionFromLocalStorage("submissions", contestId);
  const [lastEdited, setLastEdited] = useState<Date>(new Date());
  const [proposal, setProposal] = useState(savedProposal?.content || "");
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const formattedDate = lastEdited ? moment(lastEdited).format("MMMM D, h:mm a") : null;
  const isCorrectNetwork = chainId === chain?.id;
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImage } = useUploadImageStore(state => state);

  const editorProposal = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Image,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
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
        class: "prose prose-invert pt-4 md:pt-12 flex-grow focus:outline-none",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === "Enter") {
            setRevertTextOption(true);
          }
        },
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

  const onSwitchNetwork = async () => {
    await switchNetwork({ chainId });
  };

  const onSubmitProposal = async () => {
    const result = await sendProposal(proposal.trim());
    if (result) {
      const handleRouteChangeComplete = () => {
        setIsOpen(false);
        editorProposal?.commands.clearContent();
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
      };

      router.events.on("routeChangeComplete", handleRouteChangeComplete);
      goToProposalPage(chainName, contestId, result.proposalId);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      try {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          editorProposal?.chain().focus().setImage({ src: imageUrl }).run();
        } else {
          console.error("Received no URL from the upload.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <DialogModalV3
      title="submission"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="w-full xl:w-[1110px] 3xl:w-[1300px]"
    >
      <div className="flex flex-col gap-4 md:pl-[50px] lg:pl-[100px] mt-[60px] mb-[60px]">
        <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />
        <div className="flex flex-col gap-2">
          <EthereumAddress ethereumAddress={address ?? ""} shortenOnFallback={true} />
          <p className="text-[16px] font-bold text-neutral-10">{formattedDate}</p>
        </div>
        <div className="flex flex-col min-h-[12rem] rounded-md md:w-[650px]">
          <div className="flex justify-around fixed bottom-0 bg-neutral-2 md:bg-true-black z-10 md:relative md:justify-start w-full -ml-6 md:-ml-0 px-3 md:px-1 py-2 border-y border-neutral-10">
            <TipTapEditorControls editor={editorProposal} />
          </div>

          <EditorContent
            editor={editorProposal}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`md:border-b border-primary-2 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[650px] overflow-y-auto h-auto max-h-[300px] pb-2 ${
              isDragging ? "backdrop-blur-md opacity-70" : ""
            }`}
          />
        </div>
        <div className="absolute top-0 right-0 mt-[15px] mr-[15px] md:mr-0 md:flex md:relative md:mt-2">
          {isCorrectNetwork ? (
            <ButtonV3
              colorClass="bg-gradient-vote rounded-[40px]"
              size={isMobile ? ButtonSize.SMALL : ButtonSize.LARGE}
              onClick={onSubmitProposal}
              isDisabled={isLoading || !proposal.length || !editorProposal?.getText().length}
            >
              submit!
            </ButtonV3>
          ) : (
            <ButtonV3 colorClass="bg-gradient-create rounded-[40px]" size={ButtonSize.LARGE} onClick={onSwitchNetwork}>
              switch network
            </ButtonV3>
          )}
        </div>
      </div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposal;
