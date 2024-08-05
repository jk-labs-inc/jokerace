/* eslint-disable react-hooks/exhaustive-deps */
import Iframe from "@components/tiptap/Iframe";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { emailRegex } from "@helpers/regex";
import {
  SubmissionCache,
  loadSubmissionFromLocalStorage,
  removeSubmissionFromLocalStorage,
  saveSubmissionToLocalStorage,
} from "@helpers/submissionCaching";
import { useContestStore } from "@hooks/useContest/store";
import { useEditorStore } from "@hooks/useEditor/store";
import useEmailSignup from "@hooks/useEmailSignup";
import useMetadataFields from "@hooks/useMetadataFields";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { useUploadImageStore } from "@hooks/useUploadImage";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { switchChain } from "@wagmi/core";
import moment from "moment";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount, useBalance } from "wagmi";
import DialogModalSendProposalDesktopLayout from "./Desktop";
import DialogModalSendProposalMobileLayout from "./Mobile";

interface DialogModalSendProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalSendProposal: FC<DialogModalSendProposalProps> = ({ isOpen, setIsOpen }) => {
  const { address, chain } = useAccount();
  const asPath = usePathname();
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const { subscribeUser, checkIfEmailExists } = useEmailSignup();
  const { chainName, address: contestId } = extractPathSegments(asPath ?? "");
  const { sendProposal } = useSubmitProposal();
  const {
    setProposalId,
    setIsMobileConfirmModalOpen,
    wantsSubscription,
    emailForSubscription,
    setWantsSubscription,
    setEmailForSubscription,
    setEmailAlreadyExists,
  } = useSubmitProposalStore(state => state);
  const { votesOpen, charge } = useContestStore(state => state);
  const { data: accountData } = useBalance({
    address: address as `0x${string}`,
  });
  const { setRevertTextOption } = useEditorStore(state => state);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const savedProposal = loadSubmissionFromLocalStorage("submissions", contestId);
  const [lastEdited, setLastEdited] = useState<Date>(new Date());
  const [proposal, setProposal] = useState(savedProposal?.content || "");
  const formattedDate = lastEdited ? moment(lastEdited).format("MMMM D, h:mm a") : null;
  const isCorrectNetwork = chainId === chain?.id;
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImage } = useUploadImageStore(state => state);
  const { isLoading } = useMetadataFields();
  const placeholderText = isMobile ? "this is my submission..." : "this is my submission and here’s why...";

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
        placeholder: placeholderText,
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
    await switchChain(config, { chainId });
  };

  const handleSubscription = async () => {
    if (!wantsSubscription || !emailForSubscription || !emailForSubscription.match(emailRegex)) {
      return null;
    }

    // Check if the email already exists
    const emailExists = await checkIfEmailExists(emailForSubscription);
    if (emailExists) {
      setEmailAlreadyExists(true);
      return null;
    }

    return subscribeUser(emailForSubscription, address ?? "", false);
  };

  const onSubmitProposal = async () => {
    const promises = [sendProposal(proposal.trim())];

    const subscriptionPromise = await handleSubscription();
    if (subscriptionPromise) {
      promises.push(subscriptionPromise);
    }

    try {
      const [proposalResult] = await Promise.all(promises);

      if (proposalResult) {
        setProposalId(proposalResult.proposalId);
        editorProposal?.commands.clearContent();
        removeSubmissionFromLocalStorage("submissions", contestId);
        if (isMobile) {
          setIsOpen(true);
          setIsMobileConfirmModalOpen(true);
        } else {
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setWantsSubscription(false);
      setEmailForSubscription("");
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
    <>
      {isMobile ? (
        <DialogModalSendProposalMobileLayout
          chainName={chainName}
          contestId={contestId}
          proposal={proposal}
          editorProposal={editorProposal}
          address={address ?? ""}
          charge={charge}
          accountData={accountData}
          formattedDate={formattedDate}
          isOpen={isOpen}
          isCorrectNetwork={isCorrectNetwork}
          setIsOpen={setIsOpen}
          onSwitchNetwork={onSwitchNetwork}
          onSubmitProposal={onSubmitProposal}
        />
      ) : (
        <DialogModalSendProposalDesktopLayout
          proposal={proposal}
          chainName={chainName}
          contestId={contestId}
          editorProposal={editorProposal}
          address={address ?? ""}
          charge={charge}
          accountData={accountData}
          formattedDate={formattedDate}
          isOpen={isOpen}
          isCorrectNetwork={isCorrectNetwork}
          isDragging={isDragging}
          setIsOpen={setIsOpen}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          onSwitchNetwork={onSwitchNetwork}
          onSubmitProposal={onSubmitProposal}
        />
      )}
    </>
  );
};

export default DialogModalSendProposal;
