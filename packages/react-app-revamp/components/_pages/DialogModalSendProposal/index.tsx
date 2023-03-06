import Button from "@components/UI/Button";
import DialogModal from "@components/UI/DialogModal";
import Iframe from "@components/tiptap/Iframe";
import TipTapEditor from "@components/UI/TipTapEditor";
import TrackerDeployTransaction from "@components/UI/TrackerDeployTransaction";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
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
  //@ts-ignore
  const { sendProposal, isLoading, error, isSuccess } = useSubmitProposal();
  //@ts-ignore
  const { transactionData } = useSubmitProposalStore(state => state);
  const {
    amountOfTokensRequiredToSubmitEntry,
    currentUserSubmitProposalTokensAmount,
    listProposalsIds,
    currentUserProposalCount,
    contestMaxNumberSubmissionsPerUser,
    contestMaxProposalCount,
    contestStatus,
    contestPrompt,
  } = useStoreContest(state => ({
    //@ts-ignore
    contestPrompt: state.contestPrompt,
    //@ts-ignore
    currentUserSubmitProposalTokensAmount: state.currentUserSubmitProposalTokensAmount,
    //@ts-ignore
    contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
    //@ts-ignore
    contestMaxProposalCount: state.contestMaxProposalCount,
    //@ts-ignore
    currentUserProposalCount: state.currentUserProposalCount,
    //@ts-ignore
    listProposalsIds: state.listProposalsIds,
    //@ts-ignore
    amountOfTokensRequiredToSubmitEntry: state.amountOfTokensRequiredToSubmitEntry,
    //@ts-ignore
    contestStatus: state.contestStatus,
  }));
  const [showForm, setShowForm] = useState(true);
  const [showDeploymentSteps, setShowDeploymentSteps] = useState(false);
  const [proposal, setProposal] = useState("");

  const editorProposal = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapExtensionLink,
      Placeholder.configure({
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
    },
  });

  useEffect(() => {
    if (isSuccess) setShowForm(false);
    if (isLoading || error) setShowForm(true);
    if (isLoading || error || isSuccess) setShowDeploymentSteps(true);
  }, [isSuccess, isLoading, error]);

  useEffect(() => {
    if (!props.isOpen && !isLoading) {
      setProposal("");
      setShowForm(true);
      setShowForm(true);
      editorProposal?.setOptions({
        ...editorProposal.options,
        editable: true,
      });
      editorProposal?.commands.clearContent();
      setShowDeploymentSteps(false);
    }
  }, [props.isOpen, isLoading]);

  function onSubmitProposal(e: any) {
    e.preventDefault();
    editorProposal?.setEditable(false);
    sendProposal(proposal.trim());
  }

  function onClickSubmitAnotherProposal() {
    setProposal("");
    setShowForm(true);
    editorProposal?.setOptions({
      ...editorProposal.options,
      editable: true,
    });
    editorProposal?.commands.clearContent();
    setShowDeploymentSteps(false);
  }

  return (
    <DialogModal title="Submit your proposal" {...props}>
      {showDeploymentSteps && (
        <div className="animate-appear mt-2 mb-4">
          <TrackerDeployTransaction isSuccess={isSuccess} error={error} isLoading={isLoading} />
        </div>
      )}

      {showDeploymentSteps && transactionData?.proposalId && (
        <div className="mt-2 mb-4 animate-appear relative">
          <Link
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
            <a target="_blank">
              View proposal <span className="link">here</span>
            </a>
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
