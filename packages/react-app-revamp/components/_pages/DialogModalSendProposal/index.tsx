import Iframe from "@components/tiptap/Iframe";
import Button from "@components/UI/Button";
import DialogModal from "@components/UI/DialogModal";
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
import { useEffect, useState } from "react";

interface DialogModalSendProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalSendProposal = (props: DialogModalSendProposalProps) => {
  const { asPath } = useRouter();
  const { sendProposal, isLoading, error, isSuccess } = useSubmitProposal();
  const { transactionData } = useSubmitProposalStore(state => state);
  const { contestPrompt, contestStatus, contestMaxProposalCount } = useContestStore(state => state);
  const { listProposalsIds } = useProposalStore(state => state);
  const {
    amountOfTokensRequiredToSubmitEntry,
    currentUserSubmitProposalTokensAmount,
    currentUserProposalCount,
    contestMaxNumberSubmissionsPerUser,
  } = useUserStore(state => state);

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
        lastEdited: new Date(),
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
    if (!props.isOpen && !isLoading) {
      setShowForm(true);
      editorProposal?.commands.focus();
      editorProposal?.setOptions({
        ...editorProposal.options,
        editable: true,
      });
      setShowDeploymentSteps(false);
    }
  }, [props.isOpen, isLoading]);

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
    <DialogModal title="Submit your proposal" {...props} className="max-w-screen-lg">
      {showDeploymentSteps && (
        <div className="animate-appear mt-2 mb-4">
          <TrackerDeployTransaction isSuccess={isSuccess} error={error} isLoading={isLoading} />
        </div>
      )}

      {showDeploymentSteps && transactionData?.proposalId && (
        <div className="mt-2 mb-4 animate-appear relative">
          <Link
            target={"_blank"}
            href={{
              pathname: ROUTE_CONTEST_PROPOSAL,
              //@ts-ignore
              query: {
                chain: asPath.split("/")[2],
                address: asPath.split("/")[3],
                proposal: transactionData.proposalId,
              },
            }}
          >
            View proposal <span className="link">here</span>
          </Link>
        </div>
      )}

      {currentUserSubmitProposalTokensAmount >= amountOfTokensRequiredToSubmitEntry &&
      currentUserProposalCount < contestMaxNumberSubmissionsPerUser &&
      listProposalsIds.length < contestMaxProposalCount &&
      contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN ? (
        <>
          {contestPrompt && (
            <p className="mb-4 text-neutral-12 leading-tight text-2xs font-medium with-link-highlighted">
              <Interweave content={contestPrompt} matchers={[new UrlMatcher("url")]} />
            </p>
          )}
          {showForm ? (
            <>
              <form className={isLoading ? "opacity-50 pointer-events-none" : ""} onSubmit={onSubmitProposal}>
                <TipTapEditor editor={editorProposal} />
                <p className="mt-2 text-neutral-11 text-3xs">
                  Make sure to preview your proposal to check if it renders properly !
                </p>
                <Button
                  disabled={!proposal.trim().length || isLoading}
                  type="submit"
                  className={isLoading ? "hidden" : "mt-3"}
                >
                  Submit!
                </Button>
              </form>
            </>
          ) : (
            <div className="flex pt-3 items-center justify-center animate-appear">
              <Button intent="neutral-outline" onClick={onClickSubmitAnotherProposal}>
                Submit another proposal
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="italic font-bold text-neutral-11">You can&apos;t submit more proposals.</p>
        </>
      )}
    </DialogModal>
  );
};

export default DialogModalSendProposal;
