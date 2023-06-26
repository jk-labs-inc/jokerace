import Iframe from "@components/tiptap/Iframe";
import Button from "@components/UI/Button";
import DialogModal from "@components/UI/DialogModal";
import DialogModalV3 from "@components/UI/DialogModalV3";
import TipTapEditor from "@components/UI/TipTapEditor";
import TrackerDeployTransaction from "@components/UI/TrackerDeployTransaction";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import {
  loadSubmissionFromLocalStorage,
  removeSubmissionFromLocalStorage,
  saveSubmissionToLocalStorage,
  SubmissionCache,
} from "@helpers/submissionCaching";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import Image from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

interface DialogModalSendProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalSendProposal: FC<DialogModalSendProposalProps> = ({ isOpen, setIsOpen }) => {
  const { asPath } = useRouter();
  const { sendProposal, isLoading, error, isSuccess } = useSubmitProposal();
  const { transactionData } = useSubmitProposalStore(state => state);
  const { contestPrompt, contestStatus, contestMaxProposalCount, votesOpen } = useContestStore(state => state);
  const { listProposalsIds } = useProposalStore(state => state);
  const { currentUserProposalCount, contestMaxNumberSubmissionsPerUser } = useUserStore(state => state);

  const [showForm, setShowForm] = useState(true);
  const [showDeploymentSteps, setShowDeploymentSteps] = useState(false);
  const contestId = asPath.split("/")[3];
  const savedProposal = loadSubmissionFromLocalStorage("submissions", contestId);
  const [proposal, setProposal] = useState(savedProposal?.content || "");

  const editorProposal = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapExtensionLink,
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Your proposal …",
      }),
      Iframe,
    ],
    content: proposal,
    editorProps: {
      attributes: {
        class: "prose prose-invert p-3 flex-grow focus:outline-none",
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
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setShowForm(false);
      editorProposal?.commands.clearContent();
      removeSubmissionFromLocalStorage("submissions", contestId);
    }
    if (isLoading || error) setShowForm(true);
    if (isLoading || error || isSuccess) setShowDeploymentSteps(true);
  }, [isSuccess, isLoading, error]);

  useEffect(() => {
    if (!isOpen && !isLoading) {
      setShowForm(true);
      editorProposal?.commands.focus();
      editorProposal?.setOptions({
        ...editorProposal.options,
        editable: true,
      });
      setShowDeploymentSteps(false);
    }
  }, [isOpen, isLoading]);

  const onSubmitProposal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendProposal(proposal.trim());
  };

  const onClickSubmitAnotherProposal = () => {
    setProposal("");
    setShowForm(true);
    editorProposal?.setOptions({
      ...editorProposal.options,
      editable: true,
    });
    setShowDeploymentSteps(false);
  };

  return (
    <DialogModalV3
      title="submission"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="xl:w-[1110px] 3xl:w-[1300px] h-[700px]"
    >
      <div className="md:pl-[50px] lg:pl-[100px]"></div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposal;
