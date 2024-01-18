import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import {
  generateFacebookShareUrlForSubmission,
  generateLensShareUrlForSubmission,
  generateLinkedInShareUrlForSubmission,
  generateTwitterShareUrlForSubmission,
} from "@helpers/share";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface DialogModalSendProposalSuccessLayoutProps {
  chainName: string;
  contestId: string;
  proposalId: string;
}

const DialogModalSendProposalSuccessLayout: FC<DialogModalSendProposalSuccessLayoutProps> = ({
  chainName,
  contestId,
  proposalId,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { setIsModalOpen } = useSubmitProposalStore(state => state);
  const [copyText, setCopyText] = useState("copy");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://jokerace.io/contest/${chainName}/${contestId}/submission/${proposalId}`,
      );
      setCopyText("copied!");
      setTimeout(() => setCopyText("copy"), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  return (
    <>
      <p className="text-[20px] text-neutral-11 font-bold">share it:</p>
      <div className="flex gap-4">
        <a
          href={generateLensShareUrlForSubmission(contestId, chainName, proposalId)}
          className="cursor-pointer"
          target="_blank"
        >
          <Image src="/socials/share-submission/lens.svg" width={32} height={32} alt="lens" />
        </a>
        <a
          href={generateTwitterShareUrlForSubmission(contestId, chainName, proposalId)}
          className="cursor-pointer"
          target="_blank"
        >
          <Image src="/socials/share-submission/twitter.svg" width={32} height={32} alt="twitter" />
        </a>
        <a href={generateLinkedInShareUrlForSubmission(contestId, chainName, proposalId)} target="_blank">
          <Image src="/socials/share-submission/linkedin.svg" width={32} height={32} alt="linkedIn" />
        </a>
        <a href={generateFacebookShareUrlForSubmission(contestId, chainName, proposalId)} target="_blank">
          <Image src="/socials/share-submission/facebook.svg" width={32} height={32} alt="fb" />
        </a>
      </div>
      <p className="text-[20px] text-neutral-11 font-bold">or copy it:</p>
      <div
        className="flex items-center w-full md:w-[320px] justify-between px-4 border-neutral-10 border h-8 rounded-[40px] cursor-pointer"
        onClick={handleCopy}
      >
        <p className="text-[16px] text-neutral-11 font-bold">https://jokerace.io...{proposalId.slice(0, 6)}</p>
        <p className="text-positive-11 font-bold text-[16px]">{copyText}</p>
      </div>
      <Link
        href={`/contest/${chainName}/${contestId}/submission/${proposalId}`}
        shallow
        scroll={false}
        onClick={() => setIsModalOpen(false)}
      >
        <ButtonV3
          colorClass="bg-gradient-share-submission rounded-[40px] mt-8"
          size={isMobile ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG}
        >
          let’s see it
        </ButtonV3>
      </Link>
    </>
  );
};

export default DialogModalSendProposalSuccessLayout;
